# 1.0.8

- Las grabaciones pueden finalizar en una tarjeta flotante de acción rápida con miniaturas de vista previa renderizadas, vista previa de reproducción desde el inicio, edición, preajuste, exportación, guardado, guardado de fuente y acciones de borrador.
- La eliminación del fondo de la cámara admite el estilo de pegatinas almacenadas en caché con vista previa de marco, sombra y contorno en escala vertical ajustable.
- La configuración de apariencia puede cambiar el editor, los paneles de inspección, las superficies de exportación, la barra de herramientas de grabación, la información sobre herramientas y las vistas previas de materiales entre los modos oscuro, claro y automático.
- Las superposiciones de cámara admiten más relaciones de aspecto, eliminación de fondo con progreso en línea, modo de retrato transparente, fondos de imágenes personalizados empaquetados y configuración con un solo clic para copiar a cada clip de la cámara.
- Las tarjetas de acción rápida se ocultan durante la selección de captura, regresan después de la grabación o cancelación, siguen la pantalla activa y permiten hacer clic en todas las tarjetas visibles.
- Las superposiciones transparentes de la cámara de retrato se exportan correctamente, las ediciones de fondo degradado actualizan la vista previa inmediatamente, los anclajes de zoom manual permanecen visibles, el arrastre de entrada de números permanece estable en los bordes de la pantalla y la pantalla de compra sigue la apariencia seleccionada.

# 1.0.7

- Los subtítulos admiten la transcripción del proveedor y del modelo local, segmentos de lectura editables, visibilidad por subtítulo, estilos con respaldo preestablecido y fondos de exportación más limpios.
- Los fondos de subtítulos admiten materiales borrosos y de vidrio líquido con desenfoque, saturación, estilo de vidrio y tinte ajustables.
- Las superposiciones de cámara admiten suavidad de esquina ajustable y un estilo predeterminado cuadrado más suave.
- Las capas de efectos ahora se denominan Anotación en todo el editor.
- La configuración del editor puede reordenar y ocultar entradas de funciones, con Animación, Teclado y Belleza ocultos de forma predeterminada y entradas ocultas adicionales recopiladas en More.
- Las grabaciones esperan a que se activen las entradas de audio de pantalla, micrófono y sistema antes de escribir el medio, y los sidecars de audio retrasados permanecen alineados en la vista previa, la exportación, los clips de la línea de tiempo y las formas de onda.
- La limpieza de la cámara después de fallas tempranas de grabación ya no falla y las fallas de escritura en poco espacio de almacenamiento mantienen los medios recuperables con una advertencia clara.
- Las teclas deshabilitadas del teclado permanecen ocultas después de reabrir proyectos, incluida la vista previa y la exportación.
- La apertura y exportación de Project procesan los cuadros de video iniciales de manera confiable, y los subtítulos densos y los grupos de línea de tiempo se separan correctamente después de un zoom más profundo.
- Los cursores flotantes de la línea de tiempo, los cabezales de reproducción y el anclaje del zoom permanecen estables durante la reproducción, el arrastre, el desplazamiento y el zoom.
- La transcripción remota de subtítulos carga audio temporal optimizado para reducir el tamaño de la solicitud y detectar antes los límites de tamaño de archivo del proveedor.
- Las vistas previas de superposición de cámaras, las pistas densas de la línea de tiempo y la edición de segmentos de subtítulos responden mejor en grabaciones largas.

# 1.0.6

- Las grabaciones se pueden pausar y reanudar desde la barra de herramientas, la barra de menú o CLI, y el tiempo de pausa se omite del espacio de trabajo guardado.
- Las capas de efectos de imagen pueden aparecer y desaparecer u omitir animaciones de entrada y salida.
- El título del encabezado del editor abre opciones del espacio de trabajo para cambiar el nombre y mostrar el archivo .cam en Finder.
- Crop Source puede escalar las dimensiones de origen por proporción, ancho o alto.
- El relleno Screen Size se puede ajustar por borde con un rango máximo más alto, y Device Padding admite desplazamientos negativos de hasta 3000 px.
- Los borradores de grabaciones permanecen separados de los espacios de trabajo .cam guardados, mantienen las opciones de guardar/eliminar en el momento del cierre, aparecen en Recientes y se guardan en carpetas seleccionadas sin autorización repetida ni errores de medios faltantes.
- Las grabaciones de pantalla H.264 se inician de manera confiable en sistemas que rechazan sugerencias de codificador de velocidad de fotogramas no compatibles.
- El deshacer del editor y la representación del cursor de vista previa son más confiables durante deshacer repetidos y actualizaciones de diseño transitorias.
- Las superposiciones de la cámara ya no se vuelven negras después de recortar un clip de grabación a su longitud mínima y deshacerlo.
- Las vistas previas de creación de pistas de zoom crean el clip de zoom cuando se hace clic.
- Los efectos de clic del cursor permanecen alineados en las maquetas iPhone giratorias.
- Los bordes de la maqueta ocultan espacios finos sin cubrir la grabación.
- Los efectos de clic del cursor están desactivados de forma predeterminada y los cursores en los que se hace clic se reducen con mayor claridad.
- Las formas de cursor grabadas conservan más estados del sistema, y los estilos de cursor personalizados recurren al puntero predeterminado para formas no compatibles.
- La barra de herramientas de grabación se abre de manera confiable desde el Dock, la barra de menú y los accesos directos después de cambiar los espacios del escritorio, mientras mantiene su cristal y su posición durante la captura y grabación de audio.
- La selección de grabación de la ventana mantiene una barra de herramientas compacta con controles de salida Esc en los que se puede hacer clic.
- La reproducción de vista previa del sonido de clic sigue respondiendo en grabaciones con historiales de eventos de cursor densos.

# 1.0.5

- Las exportaciones pueden continuar en segundo plano con estimaciones del tiempo restante, una superficie de progreso de muesca personalizable, acciones de exportación completadas y restauración de ventanas estilo genio.
- La división de la línea de tiempo tiene un modo dedicado con retención Option, un cursor de tijera y enfoque de grabación de audio vinculado.
- La configuración del cursor puede ocultar un cursor inactivo y usar sonidos de clic descargables que se reproducen en vista previa y exportación, con sonidos descargados disponibles sin conexión.
- Los activos de la maqueta se pueden descargar y actualizar desde el catálogo, con las opciones de serie, modelo, color y caja y correa del Apple Watch reflejadas en la vista previa.
- La exportación GIF agrega ajustes preestablecidos de resolución 1080p e inferiores y un tamaño de archivo estimado antes de la exportación.
- Los espacios de trabajo existentes mantienen la maqueta seleccionada mientras los activos migrados terminan de descargarse.
- Las exportaciones GIF conservan los colores claros de la interfaz de usuario y la geometría de la capa de efectos con mayor precisión.
- Cambiar entre la exportación GIF y Live Photo mantiene estable la vista previa del recorte y el selector de formato GIF responde en todo su segmento.
- Los clips de línea de tiempo muy cortos son más fáciles de seleccionar sin recortarlos accidentalmente.
- Las descargas del catálogo de maquetas utilizan menos memoria y las exportaciones largas de GIF asignan menos buffers de fotogramas.

# 1.0.4

- Las superposiciones de vista previa comparten controles de cambio de tamaño de cuadrados, cambio de tamaño de bordes, cambio de tamaño de teclas modificadoras y arrastre directo del radio de las esquinas.
- Los efectos de enfoque pueden cubrir el fotograma completo mientras se editan grabaciones de maquetas.
- Los clips de efectos muestran íconos de tipo, se les puede cambiar el nombre y usan contenido de texto como etiquetas cuando no tienen nombre.
- ScreenCam puede seleccionar y grabar sus propias ventanas de aplicaciones.
- La pantalla de compra ofrece una compra única de ScreenCam Pro Lifetime junto con suscripciones.
- La vista previa de la superposición al arrastrar y cambiar el tamaño se mantiene precisa durante el zoom y la escala automática de la cámara.
- Los efectos de texto mantienen el tamaño de fuente configurado cuando los cuadros de texto se reducen.
- Las máscaras de efecto de enfoque combinan mejor con las esquinas de la pantalla de maqueta y los contornos de selección.
- Los paquetes de espacios de trabajo renombrados se siguen guardando automáticamente sin alertas de medios faltantes.
- Los menús del dispositivo de grabación se actualizan cuando se conectan o retiran micrófonos o cámaras.
- Las grabaciones maestras recortadas se pueden arrastrar a su duración original y las líneas de tiempo densas se desplazan verticalmente en ventanas cortas del editor.
- Barra de herramientas Open Workspace comienza en la carpeta predeterminada del espacio de trabajo de grabaciones.

# 1.0.3

- Las capas de efectos pueden agregar mosaicos, enfoque, texto y clips de imágenes desde una cuadrícula de vista previa compacta, con ubicación de línea de tiempo de varios carriles y renderizado de exportación.
- La edición de efectos es más precisa con edición de texto enfocada, diseño de texto ampliado estable, ubicación fuera de la pantalla, cambio de tamaño de vista previa, edición con reconocimiento de zoom y vistas previas de esquinas de imágenes en vivo.
- Se puede cambiar el tamaño del área de la pista de la línea de tiempo manteniendo visible la vista previa y evitando espacios vacíos en la pista.
- Los comandos del espacio de trabajo CLI pueden crear y actualizar clips de efectos.
- Acerca de la configuración puede abrir el registro de cambios del sitio web.
- La configuración de eventos del teclado incluye un interruptor Habilitar todo para las teclas seleccionadas.
- Las pistas de micrófono y audio del sistema grabado se pueden aumentar por encima del 100%.
- Los clips de audio y micrófono del sistema grabados permanecen alineados con las divisiones, recortes y cambios de velocidad de la grabación, con una vista previa estable y un volumen de exportación.
- Los medidores del micrófono se animan correctamente mientras se graba desde dispositivos de entrada de 24 bits.
- Los valores predeterminados de animación de la cámara comienzan desde un perfil de resorte más suave.
- La belleza de la cámara comienza con una apariencia predeterminada más fuerte y natural.
- La música de fondo se puede explorar, obtener una vista previa, importar desde el catálogo o archivos, ajustar por clip y exportar con grabación de audio.
- Las grabaciones recién terminadas recuperan la vista previa del editor de manera más confiable, incluida la carga del fondo de pantalla y los cambios en la selección del fondo de pantalla del video.
- La vista previa del editor y las exportaciones de maquetas coinciden mejor con el resultado final, incluidos los bordes, el diseño del texto y el tiempo de la animación del zoom.
- Las pistas de la línea de tiempo ampliadas mantienen las reglas, los cabezales de reproducción, las vistas previas al pasar el cursor y los cursores de clip alineados mientras se desplaza horizontalmente, y restauran el borde izquierdo a 00:00 al volver a alejar el zoom.
- La vista previa del editor silencia completamente el audio del sistema cuando su clip o pista está desactivado o eliminado.
- La vista previa de efectos, la reproducción con zoom, la exportación y la edición en espacios de trabajo grandes son más rápidas en líneas de tiempo densas.

# 1.0.2

- Los enlaces de soporte y documentos están disponibles en Configuración, Acerca de y el menú Ayuda.
- La configuración de animación muestra el movimiento primero y admite grupos plegables.
- Las entradas de números del editor utilizan controladores de arrastre de iconos y confirman los valores escritos al hacer clic fuera del campo.
- Screen Size advierte sobre la exportación de barras negras cuando el fondo es Ninguno y puede eliminarlas.
- Las dimensiones fijas de la pantalla se reducen correctamente con proporciones bloqueadas y con arrastre de altura natural.
- Los clips de zoom admiten niveles de escala de hasta 5x, con transiciones de zoom manuales más estables.
- Las vistas previas de la cámara de grabación explican que son solo de vista previa y se pueden ocultar para grabaciones futuras.
- El zoom manual, la selección de fondo de pantalla personalizado, la alineación de eventos del teclado y la edición de recortes de origen son más confiables.
- La belleza de la cámara utiliza menos CPU en la grabación de vistas previas y en la reproducción de vistas previas del editor.
- La reproducción de vista previa ya no bloquea el cierre del editor ni los paneles de archivos nativos durante la renderización compuesta intensa.
- Los ajustes de belleza de la cámara evitan el uso descontrolado de la CPU en la vista previa.
- La belleza de la cámara agrega un tinte labial natural localizado, una iluminación más suave y un mejor manejo de las imperfecciones.
- Los espacios de trabajo .cam guardados automáticamente mantienen el acceso a las carpetas para que los guardados y cierres del editor sean más confiables en ubicaciones protegidas.
- Las exportaciones de belleza de la cámara finalizan más rápido, especialmente con superposiciones de cámara más pequeñas y resultados de menor resolución.
- Los menús de relación de aspecto muestran vistas previas de formas para cada ajuste preestablecido.
- Los ajustes preestablecidos del editor se guardan sin bloquear el menú preestablecido.
- Las maquetas de dispositivos reducen la apertura de la pantalla cuando es necesario para que las grabaciones cubran la pantalla sin formato letterboxing.
- Las compras de Paywall evitan vincular el cuadro de diálogo de confirmación de Apple a una ventana de aplicación específica.
- La confirmación de suscripción de Apple es más confiable en configuraciones de múltiples pantallas, con diagnósticos enfocados en fallas de confirmación sospechosas.

# 1.0.1

- Las nuevas grabaciones se guardan automáticamente como espacios de trabajo .cam en una ubicación predeterminada configurable antes de que se abra el editor.
- La configuración de grabación muestra el espacio de trabajo guardado automáticamente y el tamaño de la caché de grabación sin formato, con limpieza de todos los elementos de la caché o de los antiguos.
- Las configuraciones agregan controles de apariencia para el color del tema, el material de la barra de herramientas y el material de información sobre herramientas.
- Las configuraciones agregan Abrir al iniciar sesión, teclas de acceso directo más grandes durante la grabación, enlaces de acceso directo extraíbles y exportación de registros de errores recientes.
- El menú Archivo agrega submenús lentos Directorio reciente y predeterminado para abrir espacios de trabajo guardados.
- El encabezado del editor agrega acciones preestablecidas para guardar, cambiar nombre, reordenar, eliminar, aplicar, compartir e importar.
- El encabezado del editor agrega más ajustes preestablecidos de aspecto del lienzo de exportación, controles de recorte de origen y exportaciones de origen con límite de 5K.
- El título del editor puede revelar el espacio de trabajo en Finder.
- El orden de las pistas de la línea de tiempo persiste como preferencia del editor, mientras que las pistas ocultas se restablecen por sesión.
- La línea de tiempo y el recorte de origen admiten el zoom mediante pellizco del trackpad, con desplazamiento en la hoja de recorte después de hacer zoom.
- La selección de área admite dimensiones escritas, guías centrales, ajustes preestablecidos de relación de aspecto y atajos de cambio de tamaño Shift/Option.
- Los controles de vista previa de la línea de tiempo agregan velocidades de reproducción de 0,25x a 2x.
- Los filtros de belleza de la cámara se pueden previsualizar y alternar durante la grabación, guardarlos como predeterminados, ajustarlos más tarde y perfeccionarlos con controles de forma que reconocen el rostro.
- La configuración predeterminada de animación de la cámara utiliza un perfil de resorte más suave y un desenfoque de movimiento más fuerte para lograr zooms más suaves.
- El movimiento de la cámara de vista previa mantiene rectas las rutas de acercamiento y alejamiento sujetas en los bordes y utiliza el desenfoque de movimiento direccional desde el centro de zoom correcto.
- La reproducción del cursor sigue el movimiento grabado con menos retraso.
- La posición del cursor y el enfoque de la cámara permanecen alineados después del recorte de la fuente.
- Las superposiciones de la cámara permanecen sincronizadas con su marco durante la reproducción de vista previa.
- La parada de grabación cambia a Processing inmediatamente y mantiene viva la finalización por más tiempo.
- La barra de herramientas de grabación flotante permanece visible al cambiar de escritorio durante la grabación.
- Los medidores de audio de la barra de herramientas de grabación muestran un movimiento de nivel más claro.
- La selección de captura de área pasa de manera confiable al frente desde la barra de herramientas de grabación flotante.
- La selección de captura de área y ventana funciona en pantallas secundarias.
- Rechazar el permiso de grabación de pantalla cancela la grabación sin mostrar un error.
- Los controles de selección de captura evitan fallas de Intel TestFlight, incluido el desplazamiento del objetivo, las actualizaciones del menú de estado de la barra de menú y la reapertura desde el Dock.
- El botón de cancelación de selección de captura responde a través de todo el control circular.
- Al pasar el botón de inicio de selección de captura ya no se bloquea la aplicación.
- Las grabaciones con sistema de audio habilitado finalizan sin colgar en Processing.
- Cerrar o salir con un editor no guardado muestra el flujo de cierre de ScreenCam en lugar del panel de guardado de documentos del sistema.
- El guardado automático del espacio de trabajo espera mientras los paneles de archivos nativos están abiertos y escribe paquetes .cam de forma más segura.
- La limpieza de la línea de tiempo y las interacciones interrumpidas ya no dejan congelada la reproducción de la vista previa ni saltan hasta el final.
- Cambiar el tamaño o arrastrar clips de la línea de tiempo ya no salta el cabezal de reproducción al tomar un clip.
- Los controles de volumen y silencio del audio de vista previa permanecen sincronizados, se animan suavemente y ya no agregan pasos para deshacer.
- Los selectores de color aceptan valores hexadecimales escritos y mantienen los controles de arrastre anclados mientras ajustan el color.
- Las etiquetas del inspector utilizan terminología de Pantalla y Dispositivo, y el selector de tamaño preestablecido coincide con otros controles de menú.
- La información sobre herramientas aparece en los controles de grabación, las pestañas del inspector y los atajos de deshacer/rehacer.
- El material transparente de información sobre herramientas mantiene las burbujas visibles sobre fondos blancos.
- Los vídeos MP4 exportados utilizan el orden de fotogramas H.264 compatible con Vista previa, evitan los metadatos de cuarentena y mantienen la sincronización del audio a velocidad normal.
- El tamaño de exportación con resolución de origen utiliza la composición de vista previa final, incluido el relleno del marco, el tamaño fijo del lienzo y el tamaño de la maqueta.
- Los lienzos exportados evitan las barras negras en los bordes causadas por el redondeo de píxeles.
- Las exportaciones de maquetas de visualización representan fondos de pantalla animados y fondos de marcos correctamente dentro del marco de la pantalla.
- La maqueta de computadora portátil exporta contenido de grabación de clips a esquinas redondeadas de la pantalla.
- Los zooms de maquetas pueden seguir el movimiento del cursor más allá del borde de origen sin ajustar el dispositivo ampliado al borde del lienzo.
- Los clips de grabación repetidos se exportan desde los fotogramas de origen correctos en lugar de fotogramas finales obsoletos.
- Las exportaciones de 4K comienzan de manera confiable en grabaciones de alta resolución en lugar de estancarse alrededor del 3%.
- Las exportaciones a largo plazo con fondos de pantalla animados o superposiciones de cámaras ya no se estancan cerca del 79%.
- Las exportaciones de audio de volumen completo conservan la tasa de bits del video H.264 renderizado en lugar de inflar el tamaño del archivo durante la mezcla de audio.
- La grabación, la reproducción de vista previa, la exportación de alta resolución y las líneas de tiempo de teclado grandes utilizan menos CPU y memoria.
- Los botones del semáforo del editor mantienen su posición nativa durante las transiciones a pantalla completa.
