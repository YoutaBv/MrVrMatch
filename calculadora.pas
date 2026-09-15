program CalculadoraProcedimientos;

{ Ejemplo compatible con Turbo Pascal 7.0 }

var
  Numero1, Numero2: Real;

procedure MostrarHolaMundo;
begin
  Writeln('Hola mundo');
  Writeln;
end;

procedure LeerNumero(const Mensaje: String; var Numero: Real);
begin
  Write(Mensaje);
  ReadLn(Numero);
end;

procedure MostrarResultados(A, B: Real);
begin
  Writeln;
  Writeln('Resultados:');
  Writeln('Suma: ', A + B:0:2);
  Writeln('Resta: ', A - B:0:2);
  Writeln('Multiplicacion: ', A * B:0:2);

  if B = 0 then
    Writeln('Division: no se puede dividir entre cero.')
  else
    Writeln('Division: ', A / B:0:2);
end;

begin
  MostrarHolaMundo;
  Writeln('Calculadora con procedimientos');
  Writeln('--------------------------------');
  LeerNumero('Ingrese el primer numero: ', Numero1);
  LeerNumero('Ingrese el segundo numero: ', Numero2);
  MostrarResultados(Numero1, Numero2);
  Writeln;
  Writeln('Presione ENTER para finalizar.');
  ReadLn;
end.
