import { Screen } from '@/components/screen';
import { AuthForm } from '@/components/auth-form';

export default function RegisterScreen() {
  return (
    <Screen horizontalPadding={0}>
      <AuthForm mode="register" />
    </Screen>
  );
}
