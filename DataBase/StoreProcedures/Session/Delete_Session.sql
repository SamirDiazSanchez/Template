CREATE PROCEDURE [dbo].[Delete_Session]
 	@SessionId UNIQUEIDENTIFIER = NULL,
	@UserName VARCHAR(100) = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	IF @UserName IS NULL AND @SessionId IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		IF @UserName IS NOT NULL
		BEGIN
			SELECT @SessionId = A.[SessionId]
			FROM [Session] A
			INNER JOIN [User] B ON A.[UserId] = B.[UserId]
			WHERE B.[UserName] = @UserName
		END

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
		WHERE [SessionId] = @SessionId

		DELETE [Session] WHERE [SessionId] = @SessionId

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
