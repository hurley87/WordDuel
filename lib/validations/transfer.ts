import * as z from 'zod';

export const transferSchema = z.object({
  address: z.string(),
  amount: z.preprocess(
    (args) => (args === '' ? undefined : args),
    z.coerce
      .number({ invalid_type_error: 'Price must be a number' })
      .positive('Price must be positive')
  ),
});
