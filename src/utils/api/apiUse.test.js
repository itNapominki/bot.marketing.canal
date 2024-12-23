const AipUse = require("./apiUse");

describe("Тест UseApi", () => {
  test("должен возвращать пользовательские данные, когда код равен 200", async () => {
    const mockApi = {
      checkUser: jest.fn().mockResolvedValue({
        result: {
          code: 200,
          message: {
            rowNumber: 1,
            spzId: 123,
            number: 456,
            name: "Михаил",
            tlgId: 789,
            tlgName: "931824462",
            status: "work",
            role: "user",
            sponsor: "sponsor123",
            sponsorName: "Sponsor Name",
          },
        },
      }),
    };

    const aipUse = new AipUse(mockApi);

    const result = await aipUse.checkUser({
      action: "check",
      tlgId: "931824462",
    });

    expect(result).toEqual({
      rowNumber: 1,
      spzId: 123,
      number: 456,
      name: "Михаил",
      tlgId: 789,
      tlgName: "931824462",
      status: "work",
      role: "user",
      sponsor: "sponsor123",
      sponsorName: "Sponsor Name",
    });

    expect(mockApi.checkUser).toHaveBeenCalledWith({
      action: "check",
      tlgId: "931824462",
    });
  });
});
