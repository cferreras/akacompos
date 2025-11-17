# Sistema de Diseño Unificado - Changelog

## 📅 Fecha de Implementación
**Fecha:** Diciembre 2024  
**Versión:** 1.0.0

---

## 🎯 Objetivo

Crear un sistema de diseño unificado y consistente para toda la aplicación, facilitando el desarrollo y mantenimiento mediante componentes reutilizables y variables CSS estandarizadas.

---

## 📦 Nuevos Componentes UI

### `/src/components/ui/`

Se ha creado un nuevo directorio con componentes base reutilizables:

#### 1. **Card.astro**
Componente de tarjeta versátil con múltiples variantes y sistema de tiers.

**Características:**
- 4 variantes: `default`, `glass`, `gradient`, `outlined`
- 5 tiers: `bronze`, `silver`, `gold`, `prismatic`, `amber`
- Efectos hover configurables
- Múltiples tamaños de padding y sombras
- Soporte para renderizado como `div`, `article`, `section`, o `a`

#### 2. **Tooltip.astro**
Sistema de tooltips con posicionamiento inteligente y auto-ajuste.

**Características:**
- Posicionamiento automático que evita los bordes de la pantalla
- Soporte para contenido HTML
- Animaciones suaves
- Actualización continua de posición
- Responsive en móviles

#### 3. **Badge.astro**
Componente de insignias/etiquetas para estados y categorías.

**Características:**
- 10 variantes pre-definidas (incluyendo estilos de juego: `fast`, `reroll`, `aggressive`, `defensive`)
- 4 tamaños: `xs`, `sm`, `md`, `lg`
- Soporte para iconos Font Awesome
- Variantes outlined (solo borde)
- Badges redondeados

#### 4. **Button.astro**
Componente de botón completo con múltiples estados.

**Características:**
- 5 variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`
- 5 tamaños: `xs`, `sm`, `md`, `lg`, `xl`
- Estados: `disabled`, `loading`
- Iconos con posición configurable
- Efecto de onda al hacer clic
- Soporte para renderizado como `button` o `a`

#### 5. **Container.astro**
Contenedor responsive con padding y ancho máximo consistente.

**Características:**
- 9 anchos máximos configurables
- Padding horizontal y vertical independientes
- Auto-centrado opcional
- Completamente responsive

#### 6. **Section.astro**
Componente de sección con título, subtítulo y divisores.

**Características:**
- 4 variantes visuales
- Títulos con gradientes
- Divisores decorativos configurables
- Espaciado consistente
- Animaciones de entrada

---

## 🎨 Sistema de Estilos Mejorado

### `/src/styles/global.css`

Se ha expandido completamente el archivo de estilos globales con:

#### **Design Tokens (Variables CSS)**

##### Colores
```css
--color-primary: 164 107 255
--color-primary-dark: 82 17 212
--color-background-dark: 22 16 34
--color-background-darker: 15 15 26
--color-surface-dark: 30 27 47
--color-surface-darker: 20 18 34
```

##### Sistema de Tiers
```css
--color-tier-bronze: 205 127 50
--color-tier-silver: 192 192 192
--color-tier-gold: 255 215 0
--color-tier-prismatic: 168 85 247
--color-tier-amber: 245 158 11
```

##### Colores de Estado
```css
--color-success: 34 197 94
--color-warning: 234 179 8
--color-error: 239 68 68
--color-info: 59 130 246
```

##### Espaciados
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 0.75rem
--spacing-lg: 1rem
--spacing-xl: 1.5rem
--spacing-2xl: 2rem
--spacing-3xl: 3rem
```

##### Radios de Borde
```css
--radius-sm: 0.25rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem
--radius-2xl: 1.5rem
--radius-full: 9999px
```

##### Sombras
- Sombras estándar: `--shadow-sm` hasta `--shadow-2xl`
- Sombras con color primario: `--shadow-primary-sm` hasta `--shadow-primary-xl`

##### Transiciones
```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

##### Z-Index
```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

#### **Utilidades CSS**

##### Clases de Tier
- `.tier-bronze`
- `.tier-silver`
- `.tier-gold`
- `.tier-prismatic`
- `.tier-amber`

Cada una con bordes y sombras automáticas apropiadas.

##### Animaciones
- `.animate-fade-in` - Aparición con fade
- `.animate-fade-in-up` - Aparición desde abajo
- `.animate-fade-in-down` - Aparición desde arriba
- `.animate-scale-in` - Aparición con escala
- `.animate-shimmer` - Efecto shimmer
- `.animate-pulse` - Pulsación
- `.animate-spin` - Rotación

##### Efectos
- `.backdrop-blur-glass` - Blur de 12px para efecto cristal
- `.backdrop-blur-strong` - Blur de 16px más intenso
- `.gradient-border` - Borde con gradiente
- `.hover-scale` - Escala al hover
- `.hover-glow` - Brillo al hover
- `.focus-ring` - Anillo de enfoque accesible

##### Scrollbar Personalizado
Estilo consistente para scrollbars en toda la aplicación con colores del tema.

---

## 📚 Documentación

### Archivos Creados

#### 1. `/src/components/ui/README.md`
Documentación completa del sistema de diseño con:
- Descripción detallada de cada componente
- Props disponibles y sus tipos
- Ejemplos de uso para cada componente
- Guía de variables CSS
- Buenas prácticas
- Ejemplos completos de patrones comunes

#### 2. `/src/components/ui/index.ts`
Archivo de barril para exportación centralizada de componentes.

#### 3. `/src/pages/design-system-demo.astro`
Página de demostración interactiva mostrando:
- Todos los componentes UI en acción
- Diferentes variantes y configuraciones
- Ejemplos de combinación de componentes
- Paleta de colores
- Casos de uso reales

---

## 🔄 Mejoras en Componentes Existentes

### Componentes que pueden beneficiarse del nuevo sistema:

1. **AugmentGrid.astro** → Puede usar `Card` y `Tooltip` unificados
2. **TraitsDisplay.astro** → Puede usar `Card`, `Badge` y `Tooltip` unificados
3. **ItemWithImage.astro** → Puede usar `Tooltip` unificado
4. **Navbar.astro** → Puede usar `Button` para los enlaces
5. **Footer.astro** → Puede usar `Container` para consistencia
6. **Páginas de composiciones** → Pueden usar `Section`, `Container`, `Card`, `Badge`

---

## 🎯 Beneficios del Nuevo Sistema

### 1. **Consistencia Visual**
- Todos los componentes comparten el mismo lenguaje de diseño
- Colores, espaciados y efectos unificados
- Reducción de inconsistencias visuales

### 2. **Desarrollo Más Rápido**
- Componentes reutilizables listos para usar
- Menos CSS personalizado por componente
- Props configurables evitan duplicación de código

### 3. **Mantenibilidad**
- Cambios centralizados en variables CSS
- Un solo lugar para actualizar estilos globales
- Código más limpio y organizado

### 4. **Accesibilidad**
- Focus rings consistentes
- Soporte para `prefers-reduced-motion`
- Estructura semántica con prop `as`

### 5. **Responsive**
- Todos los componentes son responsive por defecto
- Breakpoints consistentes
- Ajustes automáticos para móviles

### 6. **Rendimiento**
- Uso de variables CSS en lugar de JavaScript
- Animaciones con GPU acceleration
- Lazy loading de tooltips

---

## 📖 Guía de Migración

### Pasos para adoptar el nuevo sistema:

#### 1. Importar componentes
```astro
---
import { Card, Button, Badge, Container, Section } from '@/components/ui';
// o importar individualmente
import Card from '@/components/ui/Card.astro';
---
```

#### 2. Reemplazar HTML personalizado
```astro
<!-- Antes -->
<div class="bg-slate-800 rounded-lg p-4 hover:scale-105">
  <h3>Título</h3>
</div>

<!-- Después -->
<Card variant="default" hover={true}>
  <h3>Título</h3>
</Card>
```

#### 3. Usar variables CSS
```astro
<!-- Antes -->
<div style="color: #a46bff;">Texto</div>

<!-- Después -->
<div class="text-primary">Texto</div>
```

#### 4. Aprovechar las utilidades
```astro
<div class="tier-gold animate-fade-in hover-glow">
  Contenido con estilos unificados
</div>
```

---

## 🚀 Próximos Pasos

### Componentes Adicionales Sugeridos

1. **Modal/Dialog** - Para ventanas modales
2. **Dropdown** - Menús desplegables
3. **Input** - Campos de formulario unificados
4. **Alert** - Mensajes de notificación
5. **Skeleton** - Estados de carga
6. **Tabs** - Navegación por pestañas
7. **Breadcrumbs** - Migas de pan
8. **Pagination** - Paginación de listas

### Mejoras Futuras

1. **Tema Claro/Oscuro** - Toggle entre temas
2. **Temas Personalizables** - Variables CSS override
3. **Storybook** - Documentación interactiva
4. **Testing** - Tests unitarios para componentes
5. **Animaciones Avanzadas** - Más transiciones personalizadas

---

## 📝 Notas Técnicas

### Compatibilidad
- **Astro:** ≥ 4.0.0
- **Tailwind CSS:** Configuración existente
- **Navegadores:** Modernos (ES2020+)
- **CSS:** Variables CSS (Custom Properties)

### Dependencias
- Font Awesome 6.5.1+ (para iconos)
- Space Grotesk (tipografía)

### Accesibilidad
- Todos los componentes siguen WCAG 2.1 AA
- Soporte para lectores de pantalla
- Navegación por teclado
- `prefers-reduced-motion` respetado

---

## 🤝 Contribución

Para agregar nuevos componentes al sistema de diseño:

1. Crear el componente en `/src/components/ui/`
2. Exportarlo en `index.ts`
3. Documentarlo en `README.md`
4. Agregar ejemplos en `design-system-demo.astro`
5. Mantener consistencia con variables CSS existentes

---

## 📞 Soporte

Para preguntas o sugerencias sobre el sistema de diseño:
- Revisar `/src/components/ui/README.md`
- Ver ejemplos en `/design-system-demo`
- Consultar este changelog

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2024  
**Mantenedores:** Equipo de Frontend