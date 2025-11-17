# Sistema de Diseño Unificado - Componentes UI

Este directorio contiene todos los componentes UI reutilizables del proyecto. Estos componentes están diseñados para proporcionar consistencia visual y facilitar el desarrollo.

## 📦 Componentes Disponibles

### Card
Componente de tarjeta versátil para contener contenido.

**Props:**
- `variant`: 'default' | 'glass' | 'gradient' | 'outlined'
- `tier`: 'bronze' | 'silver' | 'gold' | 'prismatic' | 'amber' | null
- `hover`: boolean - Habilitar efectos de hover
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `rounded`: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `as`: 'div' | 'article' | 'section' | 'a'
- `href`: string (si as='a')
- `className`: string

**Ejemplos:**
```astro
<!-- Card básica -->
<Card variant="default" padding="md">
  <h3>Título</h3>
  <p>Contenido</p>
</Card>

<!-- Card con tier (rango) -->
<Card tier="gold" hover={true}>
  <h3>Item Dorado</h3>
</Card>

<!-- Card como enlace -->
<Card as="a" href="/ruta" hover={true} variant="glass">
  <h3>Card clickeable</h3>
</Card>
```

---

### Tooltip
Componente de tooltip con posicionamiento inteligente.

**Props:**
- `content`: string - Contenido HTML del tooltip
- `position`: 'top' | 'bottom' | 'left' | 'right' | 'auto'
- `delay`: number - Retraso en ms antes de mostrar
- `maxWidth`: string - Ancho máximo del tooltip
- `className`: string
- `tooltipClassName`: string

**Ejemplos:**
```astro
<!-- Tooltip básico -->
<Tooltip content="Este es un tooltip">
  <button>Hover me</button>
</Tooltip>

<!-- Tooltip con contenido HTML -->
<Tooltip 
  content="<strong>Título</strong><br/>Descripción detallada"
  position="top"
  delay={200}
  maxWidth="300px"
>
  <span>Elemento con tooltip</span>
</Tooltip>
```

---

### Badge
Componente de insignia/etiqueta para mostrar estados o categorías.

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'fast' | 'reroll' | 'aggressive' | 'defensive'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `rounded`: boolean - Badge redondeado
- `outlined`: boolean - Solo borde, sin relleno
- `icon`: string - Nombre del icono Font Awesome
- `className`: string

**Ejemplos:**
```astro
<!-- Badge básico -->
<Badge variant="primary">Nuevo</Badge>

<!-- Badge con icono -->
<Badge variant="success" icon="check" size="sm">
  Completado
</Badge>

<!-- Badge outlined -->
<Badge variant="warning" outlined={true}>
  Advertencia
</Badge>

<!-- Badges de juego -->
<Badge variant="fast">Fast 8</Badge>
<Badge variant="reroll">Reroll</Badge>
<Badge variant="aggressive">Agresivo</Badge>
```

---

### Button
Componente de botón con múltiples variantes y estados.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `fullWidth`: boolean
- `disabled`: boolean
- `loading`: boolean
- `icon`: string - Nombre del icono Font Awesome
- `iconPosition`: 'left' | 'right'
- `as`: 'button' | 'a'
- `href`: string (si as='a')
- `target`: string
- `type`: 'button' | 'submit' | 'reset'
- `className`: string

**Ejemplos:**
```astro
<!-- Botón básico -->
<Button variant="primary">
  Guardar
</Button>

<!-- Botón con icono -->
<Button variant="secondary" icon="plus" iconPosition="left">
  Agregar Item
</Button>

<!-- Botón de carga -->
<Button loading={true}>
  <span slot="loading">Guardando...</span>
  Guardar
</Button>

<!-- Botón como enlace -->
<Button as="a" href="/ruta" variant="outline">
  Ver más
</Button>

<!-- Botón ancho completo -->
<Button fullWidth={true} size="lg">
  Continuar
</Button>
```

---

### Container
Componente de contenedor con padding y ancho máximo consistente.

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `paddingY`: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
- `paddingX`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `center`: boolean - Centrar horizontalmente
- `className`: string

**Ejemplos:**
```astro
<!-- Container básico -->
<Container maxWidth="xl">
  <h1>Contenido</h1>
</Container>

<!-- Container con padding personalizado -->
<Container maxWidth="lg" paddingY="xl" paddingX="md">
  <div>Contenido con espaciado</div>
</Container>

<!-- Container sin centrar -->
<Container center={false} padding="none">
  <div>Contenido alineado a la izquierda</div>
</Container>
```

---

### Section
Componente de sección con título y estilos consistentes.

**Props:**
- `title`: string - Título de la sección
- `subtitle`: string - Subtítulo de la sección
- `id`: string - ID para navegación por anclaje
- `variant`: 'default' | 'gradient' | 'glass' | 'bordered'
- `spacing`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `divider`: boolean - Mostrar línea divisoria
- `dividerPosition`: 'top' | 'bottom' | 'both'
- `className`: string

**Ejemplos:**
```astro
<!-- Section con título -->
<Section 
  title="Composiciones Destacadas"
  subtitle="Las mejores composiciones del parche actual"
  spacing="lg"
>
  <div>Contenido de la sección</div>
</Section>

<!-- Section con variante glass -->
<Section 
  title="Augmentos"
  variant="glass"
  divider={true}
  id="augmentos"
>
  <div>Grid de augmentos</div>
</Section>

<!-- Section con divisores -->
<Section 
  title="Traits"
  divider={true}
  dividerPosition="both"
  spacing="xl"
>
  <div>Display de traits</div>
</Section>
```

---

## 🎨 Sistema de Tiers/Rangos

Los componentes soportan un sistema unificado de tiers (rangos) que aplica estilos visuales consistentes:

- **bronze**: Bronce - Color naranja/marrón
- **silver**: Plata - Color plateado
- **gold**: Oro - Color dorado
- **prismatic**: Prismático - Color morado
- **amber**: Ámbar - Color ámbar/naranja brillante

**Uso:**
```astro
<Card tier="gold">Item Dorado</Card>
<Badge variant="success">Tier Activo</Badge>
```

---

## 🎯 Variables CSS (Design Tokens)

Todas las variables CSS están definidas en `src/styles/global.css`:

### Colores
```css
--color-primary: 164 107 255
--color-primary-dark: 82 17 212
--color-background-dark: 22 16 34
--color-background-darker: 15 15 26
--color-surface-dark: 30 27 47
--color-surface-darker: 20 18 34
```

### Tiers
```css
--color-tier-bronze: 205 127 50
--color-tier-silver: 192 192 192
--color-tier-gold: 255 215 0
--color-tier-prismatic: 168 85 247
--color-tier-amber: 245 158 11
```

### Espaciados
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 0.75rem
--spacing-lg: 1rem
--spacing-xl: 1.5rem
--spacing-2xl: 2rem
--spacing-3xl: 3rem
```

### Radios de Borde
```css
--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem
--radius-2xl: 1.5rem
--radius-full: 9999px
```

### Sombras
```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl
--shadow-primary-sm
--shadow-primary-md
--shadow-primary-lg
--shadow-primary-xl
```

### Transiciones
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔧 Utilidades CSS

### Clases de Tier
```css
.tier-bronze
.tier-silver
.tier-gold
.tier-prismatic
.tier-amber
```

### Animaciones
```css
.animate-fade-in
.animate-fade-in-up
.animate-fade-in-down
.animate-scale-in
.animate-shimmer
.animate-pulse
.animate-spin
```

### Efectos
```css
.backdrop-blur-glass
.backdrop-blur-strong
.gradient-border
.hover-scale
.hover-glow
.focus-ring
```

---

## 📝 Buenas Prácticas

1. **Usa los componentes UI en lugar de HTML directo** cuando sea posible para mantener consistencia.

2. **Aprovecha las variantes** en lugar de crear estilos personalizados desde cero.

3. **Usa las variables CSS** en lugar de valores hardcodeados:
   ```astro
   <!-- ❌ No hacer -->
   <div style="color: #a46bff;">...</div>
   
   <!-- ✅ Hacer -->
   <div class="text-primary">...</div>
   ```

4. **Combina componentes** para crear interfaces complejas:
   ```astro
   <Section title="Mis Composiciones" spacing="lg">
     <Container maxWidth="xl">
       <div class="grid grid-cols-3 gap-4">
         <Card hover={true} variant="glass">
           <Badge variant="primary">Nuevo</Badge>
           <h3>Composición 1</h3>
         </Card>
       </div>
     </Container>
   </Section>
   ```

5. **Mantén la accesibilidad** usando las props semánticas como `as`, `aria-*`, y `role`.

---

## 🚀 Importación

```astro
---
// Importar componentes individuales
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Badge from '@/components/ui/Badge.astro';

// O importar desde el index (si está configurado el alias)
import { Card, Button, Badge } from '@/components/ui';
---
```

---

## 🎨 Ejemplos Completos

### Tarjeta de Composición
```astro
<Card 
  as="a" 
  href={`/compositions/${slug}`}
  variant="gradient"
  hover={true}
  rounded="xl"
  shadow="lg"
>
  <div class="aspect-video mb-4">
    <img src={coverImage} alt={title} />
  </div>
  
  <div class="flex gap-2 mb-3">
    <Badge variant="primary" icon="star">S Tier</Badge>
    <Badge variant="fast">Fast 8</Badge>
  </div>
  
  <h3 class="text-xl font-bold mb-2">{title}</h3>
  <p class="text-slate-400">{description}</p>
  
  <Button variant="outline" size="sm" className="mt-4">
    Ver detalles
  </Button>
</Card>
```

### Sección de Augmentos
```astro
<Section 
  title="Augmentos Recomendados"
  subtitle="Los mejores augmentos para esta composición"
  variant="glass"
  spacing="xl"
  divider={true}
>
  <Container maxWidth="lg">
    <div class="grid grid-cols-3 gap-4">
      {augments.map(aug => (
        <Tooltip content={aug.description}>
          <Card tier={aug.tier} hover={true}>
            <img src={aug.image} alt={aug.name} />
            <p class="text-center mt-2">{aug.name}</p>
          </Card>
        </Tooltip>
      ))}
    </div>
  </Container>
</Section>
```

---

## 📚 Recursos Adicionales

- **Tailwind CSS**: Utilizado para utilidades adicionales
- **Font Awesome**: Iconos (prefijo `fa-solid fa-*`)
- **Space Grotesk**: Tipografía principal

---

**Mantén este sistema de diseño actualizado** a medida que agregues nuevos componentes o variantes. La consistencia es clave para una buena experiencia de usuario.