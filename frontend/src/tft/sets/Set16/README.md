# Set 16

Este directorio representa el adaptador legacy del proyecto.

- Los assets reales siguen viviendo en `frontend/src/utils` y `frontend/src/assets`.
- El runtime de `Set16` encapsula campeones, objetos, sinergias y aumentos existentes.
- Se mantiene así para no romper el contenido actual mientras el proyecto migra a un modelo multi-set.

Si en el futuro quieres mover Set 16 a una carpeta totalmente autónoma, el punto de entrada a reemplazar es `index.ts`.
