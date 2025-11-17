# Guía de Inicio Rápido - Sistema de Diseño

¡Bienvenido al sistema de diseño unificado de AKACompos! Esta guía te ayudará a empezar a usar los componentes rápidamente.

## 📦 Instalación

Los componentes ya están instalados en tu proyecto. Solo necesitas importarlos:

```astro
---
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Badge from '@/components/ui/Badge.astro';
import Container from '@/components/ui/Container.astro';
import Section from '@/components/ui/Section.astro';
import Tooltip from '@/components/ui/Tooltip.astro';
---
```

## 🚀 Primeros Pasos

### 1. Crear una Tarjeta Básica

```astro
<Card variant="default" padding="md">
  <h3 class="text-xl font-bold text-white mb-2">Mi Primera Tarjeta</h3>
  <p class="text-slate-400">Este es el contenido de la tarjeta.</p>
</Card>
```

### 2. Agregar un Botón

```astro
<Button variant="primary" icon="rocket">
  Comenzar
</Button>
```

### 3. Usar Badges (Etiquetas)

```astro
<div class="flex gap-2">
  <Badge variant="primary">Nuevo</Badge>
  <Badge variant="success" icon="check">Completado</Badge>
  <Badge variant="fast">Fast 8</Badge>
</div>
```

### 4. Agregar Tooltips

```astro
<Tooltip content="Esta es una descripción útil">
  <Button variant="outline">Hover me</Button>
</Tooltip>
```

### 5. Estructurar con Container y Section

```astro
<Section 
  title="Mi Sección"
  subtitle="Una descripción de la sección"
  spacing="lg"
>
  <Container maxWidth="xl">
    <p>Contenido aquí...</p>
  </Container>
</Section>
```

## 🎨 Ejemplo Completo: Tarjeta de Composición

```astro
---
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Badge from '@/components/ui/Badge.astro';
import Tooltip from '@/components/ui/Tooltip.astro';
---

<Card 
  variant="glass"
  hover={true}
  rounded="xl"
  shadow="lg"
>
  <!-- Imagen de portada -->
  <div class="aspect-video bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4">
    <img src="/composicion.jpg" alt="Composición" class="w-full h-full object-cover rounded-lg" />
  </div>

  <!-- Badges de información -->
  <div class="flex gap-2 mb-3">
    <Badge variant="primary" icon="star">S Tier</Badge>
    <Badge variant="fast">Fast 8</Badge>
    <Badge variant="aggressive">Agresivo</Badge>
  </div>

  <!-- Título y descripción -->
  <h3 class="text-xl font-bold text-white mb-2">
    Composición Akali Reroll
  </h3>
  <p class="text-slate-400 text-sm mb-4">
    Composición basada en reroll de Akali con traits de Asesinos y KDA.
  </p>

  <!-- Botones de acción -->
  <div class="flex gap-2">
    <Tooltip content="Ver detalles completos de la composición">
      <Button variant="primary" size="sm" icon="eye" fullWidth={true}>
        Ver Detalles
      </Button>
    </Tooltip>
  </div>
</Card>
```

## 🎯 Sistema de Tiers

Usa los tiers para resaltar elementos importantes:

```astro
<!-- Bronze -->
<Card tier="bronze">Tier Bronce</Card>

<!-- Silver -->
<Card tier="silver">Tier Plata</Card>

<!-- Gold -->
<Card tier="gold">Tier Oro</Card>

<!-- Prismatic -->
<Card tier="prismatic">Tier Prismático</Card>

<!-- Amber -->
<Card tier="amber">Tier Ámbar</Card>
```

## 🎨 Usar Variables CSS

En lugar de colores hardcodeados, usa las variables CSS:

```astro
<!-- ❌ No hacer -->
<div style="color: #a46bff; background: #161022;">
  Texto
</div>

<!-- ✅ Hacer -->
<div class="text-primary bg-background-dark">
  Texto
</div>
```

### Variables Disponibles:

**Colores:**
- `text-primary` - Color primario
- `bg-background-dark` - Fondo oscuro
- `bg-surface-dark` - Superficie oscura
- `border-primary` - Borde primario

**Tiers:**
- `tier-bronze` - Bronce
- `tier-silver` - Plata
- `tier-gold` - Oro
- `tier-prismatic` - Prismático
- `tier-amber` - Ámbar

**Animaciones:**
- `animate-fade-in` - Aparecer con fade
- `animate-scale-in` - Aparecer con escala
- `hover-scale` - Escalar al hover
- `hover-glow` - Brillo al hover

## 📱 Responsive por Defecto

Todos los componentes son responsive automáticamente:

```astro
<Container maxWidth="xl" paddingY="lg">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Card>Tarjeta 1</Card>
    <Card>Tarjeta 2</Card>
    <Card>Tarjeta 3</Card>
  </div>
</Container>
```

## 🔍 Ver Más Ejemplos

1. **Documentación Completa:** `src/components/ui/README.md`
2. **Demo Interactiva:** Navega a `/design-system-demo` en tu navegador
3. **Changelog:** `DESIGN_SYSTEM_CHANGELOG.md` en la raíz del frontend

## 💡 Tips Rápidos

### Combinar Componentes

```astro
<Section title="Composiciones" spacing="xl">
  <Container maxWidth="xl">
    <div class="grid grid-cols-3 gap-6">
      {compositions.map(comp => (
        <Card hover={true} variant="glass">
          <Badge variant="primary">{comp.tier}</Badge>
          <h3>{comp.title}</h3>
          <Button variant="outline" size="sm">Ver</Button>
        </Card>
      ))}
    </div>
  </Container>
</Section>
```

### Usar Props Condicionales

```astro
<Card 
  tier={composition.tier === 'S' ? 'gold' : 'silver'}
  hover={true}
  variant={composition.featured ? 'gradient' : 'default'}
>
  {/* contenido */}
</Card>
```

### Estados de Loading

```astro
<Button loading={isLoading} variant="primary">
  <span slot="loading">Guardando...</span>
  Guardar Composición
</Button>
```

## ⚡ Atajos Comunes

### Tarjeta Clickeable

```astro
<Card as="a" href="/ruta" hover={true}>
  Contenido clickeable
</Card>
```

### Badge con Icono

```astro
<Badge variant="success" icon="check" size="sm">
  Completado
</Badge>
```

### Botón con Icono

```astro
<Button icon="plus" iconPosition="left" variant="primary">
  Agregar Nuevo
</Button>
```

### Tooltip en Badge

```astro
<Tooltip content="Esta es una estrategia rápida">
  <Badge variant="fast">Fast 8</Badge>
</Tooltip>
```

## 🐛 Solución de Problemas

### Los estilos no se aplican

1. Verifica que `global.css` esté importado en `Layout.astro`
2. Asegúrate de usar las clases correctas (ver `README.md`)

### Los iconos no aparecen

1. Verifica que Font Awesome esté cargado en `Layout.astro`
2. Usa el formato correcto: `icon="nombre-icono"` (sin prefijo `fa-solid`)

### TypeScript da errores

1. Asegúrate de usar las props correctas (ver tipos en cada componente)
2. Usa type assertion si es necesario: `tier={tier as "gold"}`

## 📚 Recursos

- **README Completo:** Documentación detallada de todos los componentes
- **Changelog:** Historial de cambios y mejoras
- **Demo Page:** `/design-system-demo` - Ejemplos interactivos
- **Global CSS:** `src/styles/global.css` - Todas las variables CSS

## 🤝 Siguientes Pasos

1. ✅ Lee el README completo en `README.md`
2. 🎨 Visita `/design-system-demo` para ver ejemplos
3. 🚀 Empieza a usar los componentes en tus páginas
4. 💬 Comparte feedback y sugerencias con el equipo

---

**¡Feliz desarrollo! 🎉**