# MrVrMatch

## Programas de ejemplo en Turbo Pascal

Este repositorio contiene tres programas compatibles con **Turbo Pascal 7.0**:

| Archivo | Propósito |
| --- | --- |
| `hola_mundo.pas` | Muestra el mensaje `Hola mundo`. |
| `operaciones.pas` | Solicita dos números y muestra la suma, resta, multiplicación y división. |
| `calculadora.pas` | Integra las operaciones anteriores utilizando varios `PROCEDURE`. |

### Programa modular

`calculadora.pas` está organizado mediante los siguientes procedimientos:

- `MostrarHolaMundo` muestra el saludo inicial.
- `LeerNumero` solicita y lee cada número.
- `MostrarResultados` calcula y muestra las cuatro operaciones.

El programa evita dividir entre cero y muestra un mensaje informativo cuando el segundo número es `0`. Los valores se leen como `Real`, por lo que se aceptan números enteros y decimales.

### Ejecución en Turbo Pascal

Abra el archivo `.pas` en Turbo Pascal, seleccione **Compile > Compile** y después **Run > Run**.

### Ejecución con Free Pascal

Como alternativa, si tiene Free Pascal instalado, compile desde una terminal:

```text
fpc hola_mundo.pas
fpc operaciones.pas
fpc calculadora.pas
```

Después ejecute el programa que desea probar, por ejemplo:

```text
./calculadora
```
