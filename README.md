# 🌞 Sol - El Sistema Planetario y Sus Servicios

Una arquitectura de microsservicios inspirada en el sistema planetario, donde cada servicio orbita alrededor del núcleo (Sol), generando frutos (datos, APIs, funcionalidades) que son consumibles por otros sistemas.

## 🌍 Concepto

Sol es un conjunto integrado de servicios donde:
- **El Sol (Núcleo)** = Core de la plataforma, autenticación, orquestación
- **Los Planetas** = Servicios especializados (Weather, Commerce, Analytics, etc.)
- **Los Frutos** = APIs RESTful, eventos, datos procesados - listos para consumir
- **Las Órbitas** = Comunicación asincrónica, colas de eventos, sincronización

## 🚀 Estructura del Proyecto

```
Sol/
├── core/              # Núcleo del sistema (Sol)
├── services/          # Servicios planetarios
│   ├── weather/       # Servicio de clima
│   ├── commerce/      # Servicio comercial
│   ├── analytics/     # Análisis y métricas
│   └── discovery/     # Descubrimiento de servicios
├── shared/            # Librerías compartidas
├── docs/              # Documentación
└── infrastructure/    # Configuración IaC
```

## 🍎 Los Frutos (Servicios Disponibles)

| Servicio | Descripción | Estado |
|----------|-------------|--------|
| Core API | Autenticación y orquestación | 🔨 En construcción |
| Weather | Datos climáticos y predicciones | 📋 Planeado |
| Commerce | Marketplace integrado | 📋 Planeado |
| Analytics | Análisis en tiempo real | 📋 Planeado |

## 🛠️ Tecnologías

- **Lenguaje**: (Por determinar)
- **API**: REST + gRPC
- **Base de Datos**: (Por determinar)
- **Orquestación**: (Por determinar)
- **CI/CD**: GitHub Actions

## 📦 Cómo Consumir los Frutos

Los servicios exponen APIs documentadas en OpenAPI/Swagger. Cada servicio es independiente pero conectado a través de eventos.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Revisa los issues y proyectos activos.

## 📄 Licencia

MIT
