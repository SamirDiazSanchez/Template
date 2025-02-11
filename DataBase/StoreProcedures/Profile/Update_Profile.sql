CREATE PROCEDURE [dbo].[Update_Profile]
 	@ProfileId UNIQUEIDENTIFIER = NULL,
	@ProfileName VARCHAR(150) = NULL,
	@ModuleIds VARCHAR(MAX) = NULL,
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
	IF @UserUpdated IS NULL
	OR NOT EXISTS (SELECT [UserId] FROM [User] WHERE [UserId] = @UserUpdated)
	BEGIN
		SET @Code = 1;
		SET @Message = 'Required parameter';
		RETURN;
	END

	IF @ProfileId IS NULL
	OR @ProfileName IS NULL
	BEGIN
		SET @Code = 2;
		SET @Message = 'Invalid parameter';
		RETURN;
	END

	INSERT INTO @ModuleList
	SELECT
		VALUE
	FROM STRING_SPLIT(@ModuleIds, ',');

	IF EXISTS (SELECT [ProfileId] FROM[Profile] WHERE [ProfileName] = @ProfileName AND [ProfileId] != @ProfileId)
	OR NOT EXISTS(SELECT 1 FROM @ModuleList)
	BEGIN
		SET @Code = 3;
		SET @Message = 'Duplicate record';
		RETURN;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		UPDATE [Profile_Module]
		SET [IsActive] = 0
		WHERE [ProfileId] = @ProfileId;

		UPDATE [Profile]
		SET [ProfileName] = @ProfileName,
			[UserUpdated] = @UserUpdated,
			[Updated] = @currentDate,
			[IsActive] = 1
		WHERE [ProfileId] = @ProfileId;

		INSERT INTO [Profile_Module]
		(
			[ModuleId],
			[ProfileId],
			[UserCreated],
			[UserUpdated],
			[Created],
			[Updated]
		)
		SELECT
			A.[ModuleId],
			@ProfileId,
			@UserUpdated,
			@UserUpdated,
			@currentDate,
			@currentDate
		FROM @ModuleList A
		LEFT JOIN [Profile_Module] B
			ON A.[ModuleId] = B.[ModuleId]
			AND B.[ProfileId] = @ProfileId
		WHERE B.[ProfileId] IS NULL

		UPDATE A
		SET A.[IsActive] = 1
		FROM [Profile_Module] A
		INNER JOIN @ModuleList B
			ON A.[ModuleId] = B.[ModuleId]
			AND A.[ProfileId] = @ProfileId;

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SET @Code = ERROR_NUMBER();
		SET @Message = ERROR_MESSAGE();

		ROLLBACK TRANSACTION;
	END CATCH
END
