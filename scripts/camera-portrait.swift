// Offline equivalent of CameraBackgroundFilter.Processor, run on every frame.
// Usage: swift camera-portrait.swift frames-directory masks-directory
import CoreImage
import CoreVideo
import ImageIO
import UniformTypeIdentifiers
import Vision

let source = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2])
let frames = try FileManager.default.contentsOfDirectory(at: source, includingPropertiesForKeys: nil)
    .filter { $0.pathExtension == "png" }.sorted { $0.lastPathComponent < $1.lastPathComponent }
let request = VNGeneratePersonSegmentationRequest()
request.qualityLevel = .accurate
request.outputPixelFormat = kCVPixelFormatType_OneComponent8
let context = CIContext(options: [.cacheIntermediates: false])
for (index, frame) in frames.enumerated() {
    try autoreleasepool {
        guard let image = CIImage(contentsOf: frame) else { fatalError("Cannot read frame") }
        try VNImageRequestHandler(ciImage: image, options: [:]).perform([request])
        guard let buffer = request.results?.first?.pixelBuffer else { fatalError("No person mask") }
        let rawMask = CIImage(cvPixelBuffer: buffer)
        let mask = rawMask.transformed(by: CGAffineTransform(
            scaleX: image.extent.width / rawMask.extent.width,
            y: image.extent.height / rawMask.extent.height
        )).clampedToExtent().applyingFilter("CIGaussianBlur", parameters: [kCIInputRadiusKey: 1.1])
            .cropped(to: image.extent)
        let url = output.appendingPathComponent(frame.lastPathComponent)
        guard let cgImage = context.createCGImage(mask, from: mask.extent),
              let destination = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)
        else { fatalError("Cannot write mask") }
        CGImageDestinationAddImage(destination, cgImage, nil)
        guard CGImageDestinationFinalize(destination) else { fatalError("PNG encoding failed") }
    }
    if index % 24 == 0 { print("Segmented \(index + 1)/\(frames.count) frames") }
}
