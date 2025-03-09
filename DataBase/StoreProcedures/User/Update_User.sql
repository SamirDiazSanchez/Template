CREATE PROCEDURE [dbo].[Update_User]
	@SessionId UNIQUEIDENTIFIER = NULL,
 	@UserId UNIQUEIDENTIFIER = NULL,
	@Email VARCHAR(100) = NULL,
	@FullName VARCHAR(100) = NULL,
	@UserName VARCHAR(100) = NULL,
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

	IF @Email IS NULL
	OR @UserId IS NULL
	OR @FullName IS NULL
	OR @UserName IS NULL
	OR @ProfileId IS NULL
	OR NOT EXISTS (
		SELECT [ProfileId]
		FROM [Profile]
		WHERE [ProfileId] = @ProfileId
		AND [IsActive] = 1
	)
	BEGIN
		SET @Code = 3;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [User]
		SET [FullName] = @FullName,
			[Email] = @Email,
			[UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[IsActive] = 1
		WHERE [UserId] = @UserId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
