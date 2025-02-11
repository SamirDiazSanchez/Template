CREATE PROCEDURE [dbo].[Save_Session]
 	@UserId UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT,
	@Id UNIQUEIDENTIFIER OUT
AS
SET NOCOUNT ON;
BEGIN
	DECLARE @currentDate DATETIME = GETUTCDATE();

	IF @UserId IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Invalid parameter';
		RETURN
	END

	IF EXISTS (SELECT TOP 1 [SessionId] FROM [Session] WHERE [UserId] = @UserId)
	BEGIN
		SET @Code = 2;
		SET @Message = 'An active session already exists';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		SET @Id = NEWID();

		INSERT INTO [Session]
		(
			[SessionId],
			[UserId],
			[Created]
		)
		VALUES
		(
			@Id,
			@UserId,
			@currentDate
		);

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
