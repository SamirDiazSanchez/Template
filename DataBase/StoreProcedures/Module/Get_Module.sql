CREATE PROCEDURE [dbo].[Get_Module]
  @UserId UNIQUEIDENTIFIER = NULL
AS
SET NOCOUNT ON;
BEGIN
  IF @UserId IS NOT NULL
  BEGIN
    SELECT
      C.[ModuleId],
      C.[ModuleName],
      C.[Created],
      C.[Updated],
      C.[UserCreated],
      C.[UserUpdated]
    FROM [User] A
    INNER JOIN [Profile_Module] B
      ON A.[ProfileId] = B.[ProfileId]
      AND B.[IsActive] = 1
    INNER JOIN [Module] C
      ON B.[ModuleId] = C.[ModuleId]
      AND C.[IsActive] = 1
    WHERE A.[UserId] = @UserId;
    RETURN;
  END

  SELECT
    A.[ModuleId],
    A.[ModuleName],
    A.[Created],
    A.[Updated],
    A.[UserCreated],
    A.[UserUpdated],
    A.[IsActive]
  FROM [Module] A
END
