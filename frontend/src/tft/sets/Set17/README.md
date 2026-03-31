# Set 17

Este directorio ya usa el press kit real del set para poblar el runtime.

Como esta preparado ahora:

- `index.ts` construye el runtime desde la carpeta raiz `D:/Desarrollo/Astro/akacompos/Set17`.
- Los campeones salen de `Set17/Champions`.
- Las sinergias e iconos salen de `Set17/Trait Icons`.
- `example-composition.json` sirve para probar el nuevo formato de Strapi con nombres reales de Set 17.

Como replicarlo para un set futuro:

1. Crea una carpeta hermana como `/Set18` con assets separados por campeones y traits.
2. Duplica `frontend/src/tft/sets/Set17` a `frontend/src/tft/sets/Set18`.
3. Cambia los globs de `index.ts` para apuntar a la nueva carpeta raiz.
4. Mantén los nombres de archivo lo mas cercanos posible a los nombres canonicos para que el runtime pueda resolverlos solo con aliases minimos.
