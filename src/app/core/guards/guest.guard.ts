import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../auth/login/services/auth-service";


export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('paso por guestGuard: isLoggedIn= ',auth.isLoggedIn());

  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
