CREATE PROCEDURE [dbo].[Update_Profile]
	@SessionId UNIQUEIDENTIFIER = NULL,
 	@ProfileId UNIQUEIDENTIFIER = NULL,
	@ProfileName VARCHAR(150) = NULL,
	@Modules VARCHAR(MAX) = NULL,
	@UserUpdated UNIQUEIDENTIFIER = NULL,
	@Code INT OUT,
	@Message VARCHAR(MAX) OUT
AS
SET NOCOUNT ON;
DECLARE @currentDate DATETIME = GETUTCDATE();
DECLARE @ModuleList AS TABLE (
	[ModuleId] UNIQUEIDENTIFIER
);
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
	OR @ProfileName IS NULL
	OR EXISTS (SELECT [ProfileId] FROM[Profile] WHERE [ProfileName] = @ProfileName AND [ProfileId] != @ProfileId)
	OR @Modules IS NULL
	BEGIN
		SET @Code = 3;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY

		UPDATE [Profile]
		SET [ProfileName] = @ProfileName,
			[UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[Modules] = @Modules,
			[IsActive] = 1
		WHERE [ProfileId] = @ProfileId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
