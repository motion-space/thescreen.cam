// Server-side authoring only: emitted packs use existing renderer material fields.
const fields = new Set(['metalness','roughness','clearcoat','clearcoatRoughness']);
export function applyMaterialProfiles(model, bindings = [], catalog = {schemaVersion:1,profiles:{}}) {
  if (catalog.schemaVersion !== 1 || !Array.isArray(bindings) || bindings.length > 128) throw new Error('Invalid material profile catalog');
  const result = structuredClone(model), assigned = new Set();
  for (const binding of bindings) {
    const profile = catalog.profiles?.[binding.profile];
    if (!profile || !Array.isArray(binding.materials) || !binding.materials.length
        || !Object.keys(profile).length || Object.entries(profile).some(([key,value]) => !fields.has(key)
          || !Number.isFinite(value) || value < 0 || value > 1)) throw new Error('Invalid material profile');
    for (const name of binding.materials) {
      const targets = result.materials.filter(m => m.name === name);
      if (!targets.length || targets.some(m => m.screen) || assigned.has(name)) throw new Error(`Invalid material binding: ${name}`);
      assigned.add(name);
      for (const material of targets) {
        Object.assign(material, profile);
        for (const finish of Object.values(material.finishes ?? {})) Object.assign(finish, profile);
      }
    }
  }
  return result;
}
