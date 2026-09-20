import { FlatList, StyleSheet, View } from 'react-native';

import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import FeedbackBanner from '../components/FeedbackBanner';
import LabeledField from '../components/LabeledField';
import ProductCard from '../components/ProductCard';
import ScreenShell from '../components/ScreenShell';
import { colors, radius, spacing } from '../theme/tokens';

export default function AdminScreens(props) {
  if (props.route === 'wf10-new') return <AdminForm {...props} mode="new" />;
  if (props.route === 'wf10-edit') return <AdminForm {...props} mode="edit" />;
  if (props.route === 'wf11') return <DeleteConfirmation {...props} />;
  return <AdminList {...props} />;
}

function AdminList({ catalog, feedback, onNavigate, onOpenForm, onSelectProduct }) {
  return (
    <ScreenShell title="Manutenção do catálogo" scroll={false}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={catalog}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item) => item.id}
        ListFooterComponent={(
          <View style={styles.listFooter}>
            <AppButton label="Sair" onPress={() => onNavigate('wf01')} variant="ghost" />
          </View>
        )}
        ListHeaderComponent={(
          <View style={styles.listHeader}>
            {feedback ? <FeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}
            <AppButton label="Novo item" onPress={() => onOpenForm('new')} />
          </View>
        )}
        renderItem={({ item }) => (
          <ProductCard context="admin" product={item}>
            <View style={styles.actions}>
              <AppButton
                label={`Editar ${item.name}`}
                onPress={() => onOpenForm('edit', item.id)}
                variant="secondary"
              />
              <AppButton
                label={`Excluir ${item.name}`}
                onPress={() => {
                  onSelectProduct(item.id);
                  onNavigate('wf11');
                }}
                variant="danger"
              />
            </View>
          </ProductCard>
        )}
      />
    </ScreenShell>
  );
}

function AdminForm({ adminForm, errors, mode, onChangeAdminForm, onNavigate, onSubmitAdminForm }) {
  const editing = mode === 'edit';
  function toggleCloud(cloud) {
    const selected = adminForm.compatibleWith.includes(cloud);
    const compatibleWith = selected
      ? adminForm.compatibleWith.filter((item) => item !== cloud)
      : [...adminForm.compatibleWith, cloud];
    onChangeAdminForm({ ...adminForm, compatibleWith });
  }
  return (
    <ScreenShell title={editing ? 'Editar item' : 'Novo item'}>
      <View style={styles.form}>
        <LabeledField
          error={errors.name}
          label="Nome do produto"
          onChangeText={(name) => onChangeAdminForm({ ...adminForm, name })}
          placeholder="Nome do produto"
          value={adminForm.name}
        />
        <View style={styles.choiceGroup}>
          <AppText variant="label">Tipo</AppText>
          {['Jogo', 'DLC'].map((type) => (
            <AppButton
              key={type}
              label={`${adminForm.type === type ? 'Selecionado: ' : ''}${type}`}
              onPress={() => onChangeAdminForm({ ...adminForm, type })}
              variant={adminForm.type === type ? 'primary' : 'ghost'}
            />
          ))}
          {errors.type ? <AppText style={styles.error}>Erro: {errors.type}</AppText> : null}
        </View>
        <LabeledField
          error={errors.price}
          keyboardType="decimal-pad"
          label="Preço"
          onChangeText={(price) => onChangeAdminForm({ ...adminForm, price })}
          placeholder="79,90"
          value={adminForm.price}
        />
        <LabeledField
          error={errors.description}
          label="Descrição"
          multiline
          onChangeText={(description) => onChangeAdminForm({ ...adminForm, description })}
          placeholder="Descrição do produto"
          value={adminForm.description}
        />
        <View accessibilityLabel="Compatível com" style={styles.choiceGroup}>
          <AppText variant="label">Compatível com</AppText>
          {['GeForce NOW', 'Boosteroid'].map((cloud) => (
            <AppButton
              key={cloud}
              label={`${adminForm.compatibleWith.includes(cloud) ? 'Selecionado: ' : ''}${cloud}`}
              onPress={() => toggleCloud(cloud)}
              variant={adminForm.compatibleWith.includes(cloud) ? 'primary' : 'ghost'}
            />
          ))}
          {errors.compatibleWith ? (
            <AppText style={styles.error}>Erro: {errors.compatibleWith}</AppText>
          ) : null}
        </View>
        <LabeledField
          error={errors.activationStore}
          label="Ativação em"
          onChangeText={(activationStore) => onChangeAdminForm({ ...adminForm, activationStore })}
          placeholder="Loja de ativação"
          value={adminForm.activationStore}
        />
      </View>
      <View style={styles.actions}>
        <AppButton
          label={editing ? 'Salvar alterações' : 'Cadastrar item'}
          onPress={() => onSubmitAdminForm(mode)}
        />
        <AppButton label="Cancelar" onPress={() => onNavigate('wf09')} variant="ghost" />
      </View>
    </ScreenShell>
  );
}

function DeleteConfirmation({ onConfirmDelete, onNavigate, selectedProduct }) {
  return (
    <ScreenShell title="Confirmar exclusão">
      <View accessibilityRole="alert" style={styles.confirmation}>
        <AppText variant="heading">
          Excluir {selectedProduct?.name ?? 'item selecionado'}?
        </AppText>
        <AppText variant="secondary">O item será removido do catálogo.</AppText>
      </View>
      <View style={styles.actions}>
        <AppButton label="Cancelar" onPress={() => onNavigate('wf09')} variant="ghost" />
        <AppButton label="Confirmar exclusão" onPress={onConfirmDelete} variant="danger" />
      </View>
    </ScreenShell>
  );
}

function Separator() { return <View style={styles.separator} />; }

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, paddingBottom: spacing.lg },
  listHeader: { gap: spacing.lg, marginBottom: spacing.lg },
  listFooter: { marginTop: spacing.lg },
  separator: { height: spacing.lg },
  form: { width: '100%', gap: spacing.lg },
  choiceGroup: { width: '100%', gap: spacing.sm },
  actions: { width: '100%', gap: spacing.md },
  error: { color: colors.danger, fontWeight: '700' },
  confirmation: {
    width: '100%',
    padding: spacing.xl,
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: colors.dangerSurface,
  },
});
