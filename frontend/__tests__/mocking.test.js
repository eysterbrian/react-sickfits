describe.skip('Mocking learning', () => {
  it('mocks a regular fn', () => {
    const fetchDogs = jest.fn();
    fetchDogs('Georgie');
    expect(fetchDogs).toHaveBeenCalled();
    fetchDogs('Buddy');
    expect(fetchDogs).toHaveBeenCalledWith('Buddy');
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });
});
