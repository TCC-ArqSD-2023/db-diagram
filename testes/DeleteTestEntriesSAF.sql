USE [saf]
GO

DELETE FROM [saf].[Associado]
      WHERE Associado.Id > 1;
DELETE FROM [saf].Conveniado
      WHERE Conveniado.Id > 1;
DELETE FROM [saf].Especialidade
      WHERE Especialidade.Id > 16;
DELETE FROM [saf].Plano
      WHERE Plano.Id > 4;
DELETE FROM [saf].Prestador
      WHERE Prestador.Id > 1;
DELETE FROM [saf].Endereco
      WHERE Endereco.Id > 10;
GO
