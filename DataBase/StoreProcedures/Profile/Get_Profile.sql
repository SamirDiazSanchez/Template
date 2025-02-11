CREATE PROCEDURE [dbo].[Get_Profile]
 	@IsActive BIT = NULL,
	@Filter VARCHAR(100) = NULL,
	@Page INT = NULL,
	@Rows INT OUT
AS
SET NOCOUNT ON;
BEGIN
	IF @IsActive IS NOT NULL
	BEGIN
		SELECT
			A.[ProfileId],
			A.[ProfileName],
			A.[Created],
			A.[Updated],
			A.[UserCreated],
			A.[UserUpdated],
			A.[IsActive]
		FROM [Profile] A
		WHERE A.[IsActive] = @IsActive;
		
		SELECT @Rows = @@ROWCOUNT;
		RETURN;
	END
	
	IF @Page IS NOT NULL
	BEGIN
		SELECT
			A.[ProfileId],
			C.[ModuleId]
		FROM [Profile] A
		INNER JOIN [Profile_Module] B
			ON A.[ProfileId] = B.[ProfileId]
		INNER JOIN [Module] C
			ON B.[ModuleId] = C.[ModuleId];

		IF @Filter IS NOT NULL
		BEGIN
			SELECT
				A.[ProfileId],
				A.[ProfileName],
				A.[Created],
				A.[Updated],
				A.[UserCreated],
				A.[UserUpdated],
				A.[IsActive]
			FROM [Profile] A
			WHERE [ProfileName] LIKE '%' + @Filter + '%'
			ORDER BY A.[ProfileName]
			OFFSET (@Page * 10) ROWS
			FETCH NEXT 10 ROWS ONLY;

			SELECT @Rows = @@ROWCOUNT;
			RETURN;
		END

		SELECT
			A.[ProfileId],
			A.[ProfileName],
			A.[Created],
			A.[Updated],
			A.[UserCreated],
			A.[UserUpdated],
			A.[IsActive]
		FROM [Profile] A
		ORDER BY A.[ProfileName]
		OFFSET (@Page * 10) ROWS
		FETCH NEXT 10 ROWS ONLY;

		SELECT @Rows = @@ROWCOUNT;
	END
END
