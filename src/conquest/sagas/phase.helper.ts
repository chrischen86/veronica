const PHASES_START_TIMES = [17, 1, 9];

export const getPhasesTimes = (startDate: Date, endDate: Date) => {
  const phases = [];

  let runningDate = startDate;

  while (runningDate < endDate) {
    phases.push(runningDate);
    const currentDate = new Date(runningDate);
    currentDate.setHours(currentDate.getHours() + 8);
    runningDate = currentDate;
  }

  return phases;
};

export const getPhases = (startDate: Date, endDate: Date) => {
  const phaseStartTimes = getPhasesTimes(startDate, endDate);

  const phases = phaseStartTimes.map((p: Date) => {
    const phaseEnd = new Date(p);
    phaseEnd.setHours(phaseEnd.getHours() + 2);
    const phase = PHASES_START_TIMES.indexOf(p.getUTCHours()) + 1;
    return { phase, startDate: p, endDate: phaseEnd };
  });

  return phases;
};
