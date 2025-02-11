CREATE PROCEDURE [dbo].[Update_User]
 	@UserId UNIQUEIDENTIFIER = NULL,
	@Mail VARCHAR(100) = NULL,
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
	IF @UserUpdated IS NULL
	OR NOT EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserUpdated)
	BEGIN
		SET @Code = 1;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	IF @Mail IS NULL
	OR PATINDEX('%[A-Za-z0-9._%+-]%@[A-Za-z0-9.-]%.[A-Za-z]%[A-Za-z]%', @Mail) = 0
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
		SET @Code = 2;
		SET @Message = 'Ivalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [User]
		SET [FullName] = @FullName,
			[Mail] = @Mail,
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
