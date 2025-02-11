CREATE PROCEDURE [dbo].[Update_Module]
  @ModuleId UNIQUEIDENTIFIER = NULL,
  @ModuleName VARCHAR(100) = NULL,
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

  IF @ModuleName IS NULL
  BEGIN
    SET @Code = 2;
		SET @Message = 'Required parameter';
    RETURN;
  END

  IF EXISTS (SELECT 1 FROM [Module] WHERE [ModuleName] = @ModuleName AND [ModuleId] != @ModuleId)
  BEGIN
    SET @Code = 3;
		SET @Message = 'Required parameter';
    RETURN;
  END

  BEGIN TRANSACTION
  BEGIN TRY
    UPDATE [Module]
    SET [ModuleName] = @ModuleName,
        [UserUpdated] = @UserUpdated,
        [Updated] = @currentDate,
        [IsActive] = 1
    WHERE [ModuleId] = @ModuleId;

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

    ROLLBACK TRANSACTION;
  END CATCH
END
