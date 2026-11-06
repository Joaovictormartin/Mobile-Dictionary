import { Screen } from '@/components/screen';
import { AuthForm } from '@/components/auth-form';

export default function LoginScreen() {
  return (
    <Screen horizontalPadding={0}>
      <AuthForm mode="login" />
    </Screen>
  );
}
