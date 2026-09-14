/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScheduleEventDefinition {
  id: string;
  titulo: string;
  diaSemana: 'Terça-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
  diaSemanaNum: number; // 0=Domingo, 2=Terça, 5=Sexta, 6=Sábado
  horarioInicio: string; // HH:MM
  horarioFim: string; // HH:MM
  tipo: 'Culto Oficial' | 'Culto de Jovens' | 'Aulas de Música' | 'Ensaio Geral da Orquestra';
  recorrencia: 'Semanal' | 'Primeiro Sábado do Mês';
  descricao: string;
  bloqueadoParaAulas: boolean;
}

export const CALENDARIO_OFICIAL_REGRAS: ScheduleEventDefinition[] = [
  {
    id: 'regra_culto_terca',
    titulo: 'Culto Oficial (Adultos) - Terça-feira',
    diaSemana: 'Terça-feira',
    diaSemanaNum: 2,
    horarioInicio: '19:00',
    horarioFim: '21:00',
    tipo: 'Culto Oficial',
    recorrencia: 'Semanal',
    descricao: 'Culto Oficial de Doutrina e Louvor da Congregação.',
    bloqueadoParaAulas: true
  },
  {
    id: 'regra_culto_sexta',
    titulo: 'Culto Oficial (Adultos) - Sexta-feira',
    diaSemana: 'Sexta-feira',
    diaSemanaNum: 5,
    horarioInicio: '19:00',
    horarioFim: '21:00',
    tipo: 'Culto Oficial',
    recorrencia: 'Semanal',
    descricao: 'Culto Oficial da Congregação com acompanhamento da Orquestra.',
    bloqueadoParaAulas: true
  },
  {
    id: 'regra_culto_domingo',
    titulo: 'Culto Oficial (Adultos) - Domingo',
    diaSemana: 'Domingo',
    diaSemanaNum: 0,
    horarioInicio: '14:00',
    horarioFim: '16:00',
    tipo: 'Culto Oficial',
    recorrencia: 'Semanal',
    descricao: 'Culto Oficial de Domingo à tarde com orquestra completa.',
    bloqueadoParaAulas: true
  },
  {
    id: 'regra_culto_jovens',
    titulo: 'Culto de Jovens e Menores',
    diaSemana: 'Domingo',
    diaSemanaNum: 0,
    horarioInicio: '09:00',
    horarioFim: '11:00',
    tipo: 'Culto de Jovens',
    recorrencia: 'Semanal',
    descricao: 'Culto especial de jovens com participação dos aprendizes e orquestra.',
    bloqueadoParaAulas: true
  },
  {
    id: 'regra_aulas_sabado',
    titulo: 'Aulas de Música da Escola Pedagógica',
    diaSemana: 'Sábado',
    diaSemanaNum: 6,
    horarioInicio: '11:00',
    horarioFim: '14:00',
    tipo: 'Aulas de Música',
    recorrencia: 'Semanal',
    descricao: 'Período oficial exclusivo para todas as turmas de teoria, métodos e prática instrumental.',
    bloqueadoParaAulas: false
  },
  {
    id: 'regra_ensaio_orquestra',
    titulo: 'Ensaio Geral da Orquestra',
    diaSemana: 'Sábado',
    diaSemanaNum: 6,
    horarioInicio: '19:00',
    horarioFim: '21:00',
    tipo: 'Ensaio Geral da Orquestra',
    recorrencia: 'Primeiro Sábado do Mês',
    descricao: 'Ensaio geral mensal obrigatório para todos os Músicos e Alunos promovidos.',
    bloqueadoParaAulas: true
  }
];

/**
 * Checks if a date is the first Saturday of its month
 */
export function isFirstSaturdayOfMonth(date: Date): boolean {
  if (date.getDay() !== 6) return false;
  const dayOfMonth = date.getDate();
  return dayOfMonth >= 1 && dayOfMonth <= 7;
}

/**
 * Helper to parse "HH:MM" into minutes from midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  const h = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);
  return h * 60 + m;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  type?: 'error' | 'warning';
  title?: string;
  reason?: string;
  suggestion?: string;
}

/**
 * Validates a class (turma) schedule string, e.g., "Sábado - 11:00 às 12:30"
 */
export function validateTurmaHorario(horarioStr: string): ConflictCheckResult {
  if (!horarioStr) {
    return {
      hasConflict: true,
      type: 'error',
      title: 'Horário em Branco',
      reason: 'O horário da turma não foi informado.',
      suggestion: 'Defina o horário no sábado entre 11:00 e 14:00 (ex: Sábado - 11:00 às 12:30).'
    };
  }

  const lower = horarioStr.toLowerCase();

  // Check if day is Saturday
  if (!lower.includes('sábado') && !lower.includes('sabado')) {
    return {
      hasConflict: true,
      type: 'warning',
      title: 'Fora do Calendário Oficial de Aulas',
      reason: 'O calendário institucional determina que todas as aulas de música ocorrem exclusivamente aos SÁBADOS.',
      suggestion: 'Ajuste o dia para "Sábado" no período de 11:00 às 14:00.'
    };
  }

  // Extract times if possible (e.g., "11:00" or "11:00 às 12:30")
  const times = horarioStr.match(/(\d{1,2}:\d{2})/g);
  if (times && times.length > 0) {
    const startMins = parseTimeToMinutes(times[0]);
    const endMins = times.length > 1 ? parseTimeToMinutes(times[1]) : startMins + 60;

    const allowedStartMins = parseTimeToMinutes('11:00');
    const allowedEndMins = parseTimeToMinutes('14:00');

    if (startMins < allowedStartMins || endMins > allowedEndMins) {
      return {
        hasConflict: true,
        type: 'warning',
        title: 'Horário Fora da Janela de Aulas (11:00 - 14:00)',
        reason: 'O horário oficial reservado para Aulas de Música no sábado é das 11:00 às 14:00.',
        suggestion: `Sugerimos encaixar a turma na janela oficial das 11:00 às 14:00 (Ex: Sábado - 11:00 às 12:30).`
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Validates a full date-time event against the official congregation schedule
 */
export function validateEventSchedule(
  dateTimeIso: string,
  tipoEvento: string
): ConflictCheckResult {
  if (!dateTimeIso) return { hasConflict: false };

  const eventDate = new Date(dateTimeIso);
  if (isNaN(eventDate.getTime())) return { hasConflict: false };

  const dayOfWeek = eventDate.getDay(); // 0=Sun, 2=Tue, 5=Fri, 6=Sat
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();
  const eventStartMins = hours * 60 + minutes;
  const eventEndMins = eventStartMins + 120; // assume 2h default duration

  // Check Terça 19:00-21:00 Culto Oficial
  if (dayOfWeek === 2) {
    const startMins = parseTimeToMinutes('19:00');
    const endMins = parseTimeToMinutes('21:00');
    if (eventStartMins < endMins && eventEndMins > startMins) {
      if (tipoEvento !== 'Culto Oficial') {
        return {
          hasConflict: true,
          type: 'error',
          title: 'Conflito com Culto Oficial de Terça-feira',
          reason: 'Terça-feira das 19:00 às 21:00 é horário reservado para Culto Oficial da Congregação.',
          suggestion: 'Agende aulas no sábado (11:00-14:00) ou ensaios no 1º sábado do mês às 19:00.'
        };
      }
    }
  }

  // Check Sexta 19:00-21:00 Culto Oficial
  if (dayOfWeek === 5) {
    const startMins = parseTimeToMinutes('19:00');
    const endMins = parseTimeToMinutes('21:00');
    if (eventStartMins < endMins && eventEndMins > startMins) {
      if (tipoEvento !== 'Culto Oficial') {
        return {
          hasConflict: true,
          type: 'error',
          title: 'Conflito com Culto Oficial de Sexta-feira',
          reason: 'Sexta-feira das 19:00 às 21:00 é horário reservado para Culto Oficial da Congregação.',
          suggestion: 'Agende aulas no sábado (11:00-14:00) ou ensaios no 1º sábado do mês às 19:00.'
        };
      }
    }
  }

  // Check Domingo 09:00-11:00 Culto de Jovens
  if (dayOfWeek === 0) {
    const startJovens = parseTimeToMinutes('09:00');
    const endJovens = parseTimeToMinutes('11:00');
    if (eventStartMins < endJovens && eventEndMins > startJovens) {
      if (tipoEvento !== 'Culto de Jovens') {
        return {
          hasConflict: true,
          type: 'warning',
          title: 'Conflito com Culto de Jovens (Domingo 09:00 - 11:00)',
          reason: 'Domingo de manhã das 09:00 às 11:00 é reservado para o Culto de Jovens e Menores.',
          suggestion: 'Utilize o sábado das 11:00 às 14:00 para aulas pedagógicas.'
        };
      }
    }

    // Check Domingo 14:00-16:00 Culto Oficial
    const startOficial = parseTimeToMinutes('14:00');
    const endOficial = parseTimeToMinutes('16:00');
    if (eventStartMins < endOficial && eventEndMins > startOficial) {
      if (tipoEvento !== 'Culto Oficial') {
        return {
          hasConflict: true,
          type: 'error',
          title: 'Conflito com Culto Oficial de Domingo (14:00 - 16:00)',
          reason: 'Domingo à tarde das 14:00 às 16:00 é reservado para Culto Oficial da Congregação.',
          suggestion: 'Evite agendamentos concorrentes durante os cultos oficiais.'
        };
      }
    }
  }

  // Check 1st Saturday of Month 19:00-21:00 Ensaio Geral
  if (dayOfWeek === 6 && isFirstSaturdayOfMonth(eventDate)) {
    const startEnsaio = parseTimeToMinutes('19:00');
    const endEnsaio = parseTimeToMinutes('21:00');
    if (eventStartMins < endEnsaio && eventEndMins > startEnsaio) {
      if (tipoEvento !== 'Ensaio Geral da Orquestra') {
        return {
          hasConflict: true,
          type: 'warning',
          title: 'Conflito com Ensaio Geral da Orquestra (1º Sábado do Mês)',
          reason: 'No 1º sábado do mês, das 19:00 às 21:00, realiza-se o Ensaio Geral Oficial da Orquestra.',
          suggestion: 'Agende outras atividades fora desse horário nobre de ensaio.'
        };
      }
    }
  }

  return { hasConflict: false };
}
