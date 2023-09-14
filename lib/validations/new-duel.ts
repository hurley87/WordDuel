import * as z from 'zod';

export const newDuelSchema = z.object({
  email: z.string().email(),
  amount: z.preprocess(
    (args) => (args === '' ? undefined : args),
    z.coerce
      .number({ invalid_type_error: 'Price must be a number' })
      .positive('Price must be positive')
      .default(0.001)
  ), // string[] | undefined
});
