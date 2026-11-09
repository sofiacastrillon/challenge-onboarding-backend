# Changelog

Este proyecto sigue el formato de [Keep a Changelog](https://keepachangelog.com/es/1.0.0/)
y usa [SemVer](https://semver.org/lang/es/) para el control de versiones.

## [1.0.2] - 2026-01-26

### Changed

- `.eslintrc.json` y `tsconfig.json`: Se excluyó "layers/common/node_modules" ya que la layer se compila aparte y no es necesario incluirlo en el linter.
- Github actions: Se añade concurrencia basado en la rama para evitar que dos deploys de la misma rama se ejecuten al mismo tiempo y se coloca el node-env a node 24 (actual LTS).
- `.nvmrc`: Para poder setear de forma rápida el environment usando nvm, se actualiza el readme para añadir esa información.
- `package.json`: Se añaden algunos scripts para que la instalación de los paquetes de la layer ocurra junto al npm install/ci, esto es debido a que automáticamente no se instalan los paquetes en las layers con el action `alegradev/alegra-actions/.github/actions/cdk-backend-deploy`.
- Se actualizan los tags siguiendo la documentación en notion y manteniendo compatibilidad con el antiguo tag (https://www.notion.so/alegraweb/Tags-SCP-29a55f93676580ea86abdf4b8be87f8d).
- Se actualizan las dependencias para utilizar alegradev/cdkless versión 0.2.0
- Se renombra el layer common que esta por defecto, ya que el arn quedaba igual para todos los proyectos que usaban este template

### Fixed

- Se añade una implementación custom del authorizer porque la anterior dejaba el payload format en 1.0 lo cual hacía que no funcionara correctamente la integración del authorizer out of the box.

## [1.0.1] - 2025-09-23

- Bug crítico en `EventBus.ts` similar al corregido en 2025-07-18, pero esta vez permitía múltiples suscripciones del mismo listener en entornos Lambda con contenedor reutilizado, provocando múltiples ejecuciones de un mismo callback por evento emitido. Para solucionarlo se agrego una validación para evitar múltiples registros de listeners. ([commit 43b8f7](https://github.com/alegradev/cdk-backend-skeleton/commit/e148c7a8391d33692785a7af3d5aadf6bd43b8f7)).

## [1.0.0] - 2025-07-18

### Added

- Changelog inicial.
- Se añadieron ejemplos de como usar Casos de uso mediante inyección de dependencía ya que ayuda a la testeabilidad y mantenibilidad.

### Changed

- Se actualizó la forma de extraer los datos del token desde el contexto de la Lambda (`event.requestContext.authorizer`) en lugar de usar el header `Authorization` directamente. ([commit 108ed91](https://github.com/alegradev/cdk-backend-skeleton/commit/108ed9175e2fa82d4174e38fe7f7eac37e705b1b))
- Se actualizó el publisher de outbox para que no lea de la BD el evento antes de publicar ya que pueden haber condiciones de carrera si no se alcanza a replicar en todos los nodos la data. Lo mejor es publicar directo lo que ya viene del DynamoStream. ([commit e6c4834](https://github.com/alegradev/cdk-backend-skeleton/commit/e6c483428ce13bf7248a078bed8ba421804bfd00))

### Fixed

- Bug crítico en `EventBus.ts` que permitía múltiples handlers del mismo event en entornos Lambda con contenedor reutilizado, provocando múltiples ejecuciones de un mismo callback por evento emitido. Para solucionarlo se agrego una validación para evitar múltiples registros de listeners. ([commit 6f6f3e](https://github.com/alegradev/cdk-backend-skeleton/commit/6f6f3ea683aa45d8e92786808ad8b6fcf13b4237)).

---
