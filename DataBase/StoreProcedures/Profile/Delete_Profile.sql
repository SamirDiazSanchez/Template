CREATE PROCEDURE [dbo].[Delete_Profile]
	@SessionId UNIQUEIDENTIFIER = NULL,
 	@ProfileId UNIQUEIDENTIFIER = NULL,
	@UserUpdated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
BEGIN
	IF @SessionId IS NULL
	OR @UserUpdated IS NULL
	BEGIN
		SET @Code = 1;
		SET @Message = 'Parameter is required';
		RETURN;
	END

	IF NOT EXISTS (SELECT 1 FROM [Session] WHERE [SessionId] = @SessionId AND [UserId] = @UserUpdated)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid account';
		RETURN;
	END

	IF @ProfileId IS NULL
	OR EXISTS (
		SELECT [UserId]
		FROM [User]
		WHERE [ProfileId] = @ProfileId
		AND [IsActive] = 1
	)
	BEGIN
		SET @Code = 3;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [Profile]
		SET [UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[IsActive] = 0
		WHERE [ProfileId] = @ProfileId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
