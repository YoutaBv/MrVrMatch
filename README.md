# MrVrMatch

## Programa de ejemplo en Turbo Pascal

El archivo `calculadora.pas` contiene un programa compatible con **Turbo Pascal 7.0**. Primero muestra el mensaje `Hola mundo`. Después solicita dos números y presenta la suma, la resta, la multiplicación y la división. Cuando el segundo número es cero, el programa informa que la división no está definida y evita realizarla.

El código está organizado mediante varios procedimientos:

- `MostrarHolaMundo` muestra el saludo inicial.
- `LeerNumero` solicita y lee cada número.
- `MostrarResultados` calcula y muestra las cuatro operaciones.

### Compilación

En Turbo Pascal, abra `calculadora.pas`, seleccione **Compile > Compile** y ejecute el programa con **Run > Run**.

Como alternativa, con Free Pascal puede compilarlo desde una terminal:

```text
fpc calculadora.pas
```

Luego ejecute el archivo generado:

```text
./calculadora
```

El programa utiliza `Real` para aceptar números enteros y decimales.
