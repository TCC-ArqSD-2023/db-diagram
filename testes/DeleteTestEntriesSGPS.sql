USE sgps
GO

DELETE FROM sgps.Consulta
      WHERE Consulta.Id > 1;
DELETE FROM sgps.TipoExame
      WHERE TipoExame.Id > 5;
DELETE FROM sgps.Exame
      WHERE Exame.Id > 21;
GO
