import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useGradesStore } from '@/store/grades.store';

import { HomeScreen } from './HomeScreen';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderHome = (onOpen = jest.fn()) =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <HomeScreen onOpen={onOpen} />
    </SafeAreaProvider>,
  );

const completeCourse = async (courseId: string, units: Record<string, number>) =>
  await act(() => {
    const s = useGradesStore.getState();
    for (const [id, v] of Object.entries(units)) {
      s.setValue(courseId, id, v);
      s.markReal(courseId, id);
    }
  });

beforeEach(() => useGradesStore.setState({ grades: {} }));

describe('home', () => {
  it('lists the 7 courses in order with code and credits', async () => {
    await renderHome();
    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(7);
    expect(cards[0]).toHaveAccessibleName('Abrir Sociología');
    expect(cards[1]).toHaveAccessibleName('Abrir Gestión de la Información');
    expect(screen.getByText('0000AGEL0103')).toBeTruthy();
    expect(screen.getAllByText('2 créditos')).toHaveLength(3);
  });

  it('starts at 0.00 counting every credit', async () => {
    await renderHome();
    expect(screen.getByTestId('general-average')).toHaveTextContent('0.00 /20');
    expect(screen.getByText('0 de 7 cursos completos · 18 créditos')).toBeTruthy();
  });

  it('a complete course gets its star; the average uses every course', async () => {
    await renderHome();
    await completeCourse('gestion-informacion', { u1: 14, u2: 13, u3: 15 }); // 14.1 -> 14
    expect(screen.getByLabelText('Curso completo')).toBeTruthy();
    expect(screen.getByTestId('general-average')).toHaveTextContent('2.33 /20'); // 14x3 / 18

    await completeCourse('filosofia-general', { u1: 10, u2: 10, u3: 11 }); // 10.4 -> 10
    expect(screen.getByTestId('general-average')).toHaveTextContent('3.44 /20'); // (42 + 20) / 18
    expect(screen.getByText('2 de 7 cursos completos · 18 créditos')).toBeTruthy();
  });

  it('simulated grades count in the average too', async () => {
    await renderHome();
    await act(() => useGradesStore.getState().setValue('matematica', 'final', 20));
    expect(screen.getByText('20.00')).toBeTruthy();
    expect(screen.getByTestId('general-average')).toHaveTextContent('3.33 /20'); // 20x3 / 18
    expect(screen.queryByLabelText('Curso completo')).toBeNull();
  });

  it('opens a course', async () => {
    const onOpen = jest.fn();
    await renderHome(onOpen);
    await fireEvent.press(screen.getByLabelText('Abrir Sociología'));
    expect(onOpen).toHaveBeenCalledWith('sociologia');
  });
});
