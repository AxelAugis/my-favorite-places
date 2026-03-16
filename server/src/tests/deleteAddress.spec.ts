import request from 'supertest';
import app from '../app';
import datasource from '../datasource';
import { Address } from '../entities/Address';
import { User } from '../entities/User';
import { faker } from '@faker-js/faker';

describe('DELETE /api/addresses/:id', () => {
  let authorizationToken = '';
  let testUser: User;

  beforeAll(async () => {
    if (!datasource.isInitialized) {
      await datasource.initialize();
    }

    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password({ length: 16 });

    const signupResponse = await request(app).post('/api/users').send({
      email,
      password,
    });

    testUser = signupResponse.body.item;

    const tokenResponse = await request(app).post('/api/users/tokens').send({
      email,
      password,
    });

    authorizationToken = tokenResponse.body.token;
  });

  afterAll(async () => {
    if (datasource.isInitialized) {
      await datasource.destroy();
    }
  });

  it('should delete an address successfully', async () => {
    const address = new Address();
    address.name = 'Musée du Louvre';
    address.lat = 48.8606;
    address.lng = 2.3352;
    address.user = testUser;
    await datasource.manager.save(address);

    const response = await request(app)
      .delete(`/api/addresses/${address.id}`)
      .set('Authorization', `Bearer ${authorizationToken}`)
      .expect(200);

    expect(response.body).toEqual({ message: 'Address deleted successfully' });

    const deletedAddress = await datasource.manager.findOne(Address, {
      where: { id: address.id }
    });
    expect(deletedAddress).toBeNull();
  });

  it('should return 404 when deleting non-existent address', async () => {
    const response = await request(app)
      .delete('/api/addresses/99999')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .expect(404);

    expect(response.body).toEqual({ error: 'Address not found' });
  });

  it('should return 400 for invalid id', async () => {
    const response = await request(app)
      .delete('/api/addresses/invalid-id')
      .set('Authorization', `Bearer ${authorizationToken}`)
      .expect(400);

    expect(response.body).toEqual({ error: 'Invalid address ID' });
  });
});