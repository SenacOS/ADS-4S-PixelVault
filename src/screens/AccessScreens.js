import { Image, StyleSheet, View } from 'react-native';

import brandIcon from '../../assets/icon.png';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import FeedbackBanner from '../components/FeedbackBanner';
import LabeledField from '../components/LabeledField';
import ScreenShell from '../components/ScreenShell';
import { colors, radius, spacing } from '../theme/tokens';

export default function AccessScreens(props) {
  return props.route === 'wf02' ? <RegisterScreen {...props} /> : <LoginScreen {...props} />;
}

function LoginScreen({ errors, feedback, loginForm, onChangeLogin, onNavigate, onSubmitLogin, route }) {
  return (
    <ScreenShell title="PixelVault">
      <View style={styles.brandPanel}>
        <Image
          accessibilityIgnoresInvertColors
          accessible={false}
          resizeMode="contain"
          source={brandIcon}
          style={styles.logo}
        />
        <AppText variant="heading">Seu catálogo de jogos em um só lugar</AppText>
      </View>
      {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
      {route === 'st01' ? (
        <FeedbackBanner
          message="Não foi possível entrar. Revise o campo indicado e tente novamente."
          tone="error"
        />
      ) : null}
      <View style={styles.form}>
        <LabeledField
          autoCapitalize="none"
          error={errors.email}
          keyboardType="email-address"
          label="E-mail"
          onChangeText={(email) => onChangeLogin({ ...loginForm, email })}
          placeholder="seu@email.com"
          value={loginForm.email}
        />
        <LabeledField
          error={errors.password}
          label="Senha"
          onChangeText={(password) => onChangeLogin({ ...loginForm, password })}
          onSubmitEditing={onSubmitLogin}
          placeholder="Digite sua senha"
          secureTextEntry
          value={loginForm.password}
        />
      </View>
      <View style={styles.actions}>
        <AppButton label="Entrar" onPress={onSubmitLogin} />
        <AppButton label="Criar conta" onPress={() => onNavigate('wf02')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

function RegisterScreen({ errors, onChangeRegister, onNavigate, onSubmitRegistration, registerForm }) {
  return (
    <ScreenShell title="Criar conta" description="Esta conta é local e vale apenas nesta sessão. Ela não será cadastrada no servidor.">
      <View style={styles.form}>
        <LabeledField
          error={errors.name}
          label="Nome"
          onChangeText={(name) => onChangeRegister({ ...registerForm, name })}
          placeholder="Seu nome"
          value={registerForm.name}
        />
        <LabeledField
          autoCapitalize="none"
          error={errors.email}
          keyboardType="email-address"
          label="E-mail"
          onChangeText={(email) => onChangeRegister({ ...registerForm, email })}
          placeholder="seu@email.com"
          value={registerForm.email}
        />
        <LabeledField
          error={errors.password}
          label="Senha"
          onChangeText={(password) => onChangeRegister({ ...registerForm, password })}
          onSubmitEditing={onSubmitRegistration}
          placeholder="Crie uma senha"
          secureTextEntry
          value={registerForm.password}
        />
      </View>
      <View style={styles.actions}>
        <AppButton label="Cadastrar conta" onPress={onSubmitRegistration} />
        <AppButton label="Voltar ao login" onPress={() => onNavigate('wf01')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  brandPanel: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.accentSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  logo: { width: 88, height: 88, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.accentDark },
  form: { width: '100%', gap: spacing.lg },
  actions: { width: '100%', gap: spacing.md },
});
