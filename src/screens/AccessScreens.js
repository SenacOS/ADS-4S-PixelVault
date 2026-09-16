import { Image, StyleSheet, View } from 'react-native';

import brandIcon from '../../assets/icon.png';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import FeedbackBanner from '../components/FeedbackBanner';
import LabeledField from '../components/LabeledField';
import ScreenShell from '../components/ScreenShell';
import { DEMO_PROFILES } from '../data/pixelVaultData';
import { colors, radius, spacing } from '../theme/tokens';

export default function AccessScreens(props) {
  return props.route === 'wf02' ? <RegisterScreen {...props} /> : <LoginScreen {...props} />;
}

function LoginScreen({ accounts, errors, feedback, loginForm, onChangeLogin, onNavigate, onSubmitLogin, route }) {
  function fillProfile(accountId) {
    const account = accounts.find((item) => item.id === accountId);
    if (account) onChangeLogin({ email: account.email, password: account.password });
  }

  return (
    <ScreenShell eyebrow={route === 'st01' ? 'ST-01 · ESTADO DE ERRO' : 'WF-01 · ACESSO'} title="PixelVault" description="Protótipo acadêmico com perfis e dados inteiramente fictícios.">
      <View style={styles.brandPanel}>
        <Image accessibilityIgnoresInvertColors accessible={false} resizeMode="contain" source={brandIcon} style={styles.logo} />
        <AppText variant="heading">Seu cofre digital demonstrativo</AppText>
      </View>
      {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
      {route === 'st01' ? <FeedbackBanner message="Não foi possível entrar. Revise o campo indicado e tente novamente." tone="error" /> : null}
      <View style={styles.form}>
        <LabeledField autoCapitalize="none" error={errors.email} keyboardType="email-address" label="E-mail" onChangeText={(email) => onChangeLogin({ ...loginForm, email })} placeholder="E-mail de demonstração" value={loginForm.email} />
        <LabeledField error={errors.password} label="Senha" onChangeText={(password) => onChangeLogin({ ...loginForm, password })} onSubmitEditing={onSubmitLogin} placeholder="Senha de demonstração" secureTextEntry value={loginForm.password} />
      </View>
      <View style={styles.actions}>
        <AppButton label="Entrar" onPress={onSubmitLogin} />
        {DEMO_PROFILES.map((profile) => <AppButton key={profile.id} accessibilityHint="Preenche dados fictícios; ainda é necessário tocar em Entrar" label={profile.label} onPress={() => fillProfile(profile.accountId)} variant="secondary" />)}
        <AppButton label="Criar conta" onPress={() => onNavigate('wf02')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

function RegisterScreen({ errors, onChangeRegister, onNavigate, onSubmitRegistration, registerForm }) {
  return (
    <ScreenShell eyebrow="WF-02 · CADASTRO" title="Criar conta" description="Conta fictícia mantida somente durante esta sessão.">
      <View style={styles.form}>
        <LabeledField error={errors.name} label="Nome" onChangeText={(name) => onChangeRegister({ ...registerForm, name })} placeholder="Nome de demonstração" value={registerForm.name} />
        <LabeledField autoCapitalize="none" error={errors.email} keyboardType="email-address" label="E-mail" onChangeText={(email) => onChangeRegister({ ...registerForm, email })} placeholder="E-mail de demonstração" value={registerForm.email} />
        <LabeledField error={errors.password} label="Senha" onChangeText={(password) => onChangeRegister({ ...registerForm, password })} onSubmitEditing={onSubmitRegistration} placeholder="Senha de demonstração" secureTextEntry value={registerForm.password} />
      </View>
      <View style={styles.actions}>
        <AppButton label="Cadastrar conta demonstrativa" onPress={onSubmitRegistration} />
        <AppButton label="Voltar ao login" onPress={() => onNavigate('wf01')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  brandPanel: { width: '100%', alignItems: 'center', gap: spacing.md, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg },
  logo: { width: 88, height: 88, borderRadius: radius.lg },
  form: { width: '100%', gap: spacing.lg },
  actions: { width: '100%', gap: spacing.md },
});
