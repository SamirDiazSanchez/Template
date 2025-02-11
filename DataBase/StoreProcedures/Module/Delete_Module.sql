CREATE PROCEDURE [dbo].[Delete_Module]
  @ModuleId UNIQUEIDENTIFIER = NULL,
  @UserUpdated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
  IF @UserUpdated IS NULL
  BEGIN
    SET @Code = 1;
    SET @Message = 'Required parameter';
    RETURN;
  END

  IF @ModuleId IS NULL
  BEGIN
    SET @Code = 2;
    SET @Message = 'Required parameter';
    RETURN;
  END

  BEGIN TRANSACTION
  BEGIN TRY
    UPDATE [Profile_Module]
    SET [IsActive] = 0
    WHERE [ModuleId] = @ModuleId;

    UPDATE [Module]
    SET [IsActive] = 0
    WHERE [ModuleId] = @ModuleId;

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    SET @Code = ERROR_NUMBER();
    SET @Message = ERROR_MESSAGE();
    ROLLBACK TRANSACTION;
  END CATCH
END
