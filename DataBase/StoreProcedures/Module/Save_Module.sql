CREATE PROCEDURE [dbo].[Save_Module]
  @ModuleName VARCHAR(100) = NULL,
  @UserCreated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
  IF @UserCreated IS NULL
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

  IF EXISTS (SELECT 1 FROM [Module] WHERE [ModuleName] = @ModuleName)
  BEGIN
    SET @Code = 3;
		SET @Message = 'Required parameter';
    RETURN;
  END

  BEGIN TRANSACTION
  BEGIN TRY
    SET @Id = NEWID();

    INSERT INTO [Module]
    (
      [ModuleId],
      [ModuleName],
      [Created],
      [Updated],
      [UserCreated],
      [UserUpdated]
    )
    VALUES
    (
      @Id,
      @ModuleName,
      @currentDate,
      @currentDate,
      @UserCreated,
      @UserCreated
    );

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

    ROLLBACK TRANSACTION;
  END CATCH
END