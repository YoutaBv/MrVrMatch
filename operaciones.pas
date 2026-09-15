program OperacionesAritmeticas;

var
  Numero1, Numero2: Real;

begin
  Writeln('Calculadora de operaciones basicas');
  Writeln('----------------------------------');
  Write('Ingrese el primer numero: ');
  ReadLn(Numero1);
  Write('Ingrese el segundo numero: ');
  ReadLn(Numero2);

  Writeln;
  Writeln('Suma: ', Numero1 + Numero2:0:2);
  Writeln('Resta: ', Numero1 - Numero2:0:2);
  Writeln('Multiplicacion: ', Numero1 * Numero2:0:2);

  if Numero2 = 0 then
    Writeln('Division: no se puede dividir entre cero.')
  else
    Writeln('Division: ', Numero1 / Numero2:0:2);
end.
