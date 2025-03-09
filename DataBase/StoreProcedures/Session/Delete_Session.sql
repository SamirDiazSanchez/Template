CREATE PROCEDURE [dbo].[Delete_Session]
	@SessionId UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
DECLARE @UserId UNIQUEIDENTIFIER;
BEGIN
	IF @SessionId IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		INSERT INTO [SessionHistory]
		(
			[SessionId],
			[UserId],
			[Created],
			[Closed]
		)
		SELECT
			[SessionId],
			[UserId],
			[Created],
			@currentDate
		FROM [Session]
		WHERE [SessionId] = @SessionId;

		DELETE [Session]
		WHERE [SessionId] = @SessionId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
