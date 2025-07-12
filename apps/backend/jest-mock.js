jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      accepted: ['test@example.com'],
      rejected: [],
      response: '250 Message accepted',
      messageId: '<random-message-id@example.com>'
    })
  })
}));
