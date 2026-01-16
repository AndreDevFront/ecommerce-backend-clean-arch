import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  handle() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
