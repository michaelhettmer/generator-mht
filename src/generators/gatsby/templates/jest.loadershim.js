global.___loader = {
    enqueue: jest.fn(),
};

jest.mock('@reach/router', () => ({
    navigate: jest.fn(),
    prefetch: jest.fn(),
}));
