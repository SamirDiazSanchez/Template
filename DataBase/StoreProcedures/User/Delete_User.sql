CREATE PROCEDURE [dbo].[Delete_User]
	@SessionId UNIQUEIDENTIFIER = NULL,
  @UserId UNIQUEIDENTIFIER = NULL,
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
	
	IF NOT EXISTS (SELECT 1 FROM [Session] WHERE [UserId] = @UserUpdated AND [SessionId] = @SessionId)
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid account';
		RETURN;
	END

	IF @UserId IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [User]
		SET [UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[IsActive] = 0
		WHERE [UserId] = @UserId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
