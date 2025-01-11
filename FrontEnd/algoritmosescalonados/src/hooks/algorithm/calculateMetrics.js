

export const calculateMetricsSJF = ( processes ) => {
    if (!Array.isArray(processes)) {
        throw new TypeError("O argumento 'processes' deve ser um array.");
      }
      let cpuUtilization = 0; 
    let contextSwitches = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let totalIdleTime = 0;
    let time = 0;

    const maxArrival = Math.min(...processes.map((p) => parseInt(p.tempoChegada)));
    const totalBurst = processes.reduce((sum, p) => sum + parseInt(p.tempoExecucao), 0);
    const totalTimeExec = maxArrival + totalBurst;

    // Ordenar processos pelo tempo de chegada
    // Primeira ordenação
    const sortedProcesses = [...processes].sort((a, b) => a.tempoChegada - b.tempoChegada);

    //Array do tmempo restante dos processos
    const remainingTimes = sortedProcesses.map(p => parseInt(p.tempoExecucao, 10));

    //For para percorrer o array remaningTimes e somar o tempo de execução


    const completed = new Set();
    let finishedProcesses = 0;

    while (finishedProcesses < sortedProcesses.length) {
        // Identificar processos disponíveis
        const availableProcesses = sortedProcesses
            .map((p, index) => ({ index, remainingTime: remainingTimes[index], tempoChegada: p.tempoChegada }))
            .filter(p => p.tempoChegada <= time && p.remainingTime > 0 && !completed.has(p.index));

        if (availableProcesses.length === 0) {
            time++;
            totalIdleTime++;
            continue;
        }

        // Selecionar o processo com menor tempo de execução restante
        const { index: currentIndex } = availableProcesses.reduce((min, p) => (p.remainingTime < min.remainingTime ? p : min));


        const currentProcess = sortedProcesses[currentIndex];
        const executionTime = remainingTimes[currentIndex];

        // Executar processo completamente
        time += executionTime;
        remainingTimes[currentIndex] -= executionTime;

        completed.add(currentIndex);
        finishedProcesses++;
        if (finishedProcesses !== processes.length) {
            contextSwitches++;
        }
        time = time + 1;

        // Calcular turnaround e tempos de espera
        const finishTime = time;
        const turnaroundTime = finishTime - currentProcess.tempoChegada;
        const waitingTime = turnaroundTime - currentProcess.tempoExecucao;

        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;
    }

   cpuUtilization  = ((time - totalIdleTime) / time) * 100;
    const averageWaitingTime = totalWaitingTime / sortedProcesses.length;
    const averageTurnaroundTime = totalTurnaroundTime / sortedProcesses.length;

    let totalExecutionTime = totalTimeExec;
    console.log("totalExecutionTime:", totalTimeExec);
    console.log("averageWaitingTime:", averageWaitingTime);
    console.log("totalWaitingTime:", totalWaitingTime);
    console.log("contextSwitches:", contextSwitches);
    console.log("cpuUtilization:", cpuUtilization);
    console.log("averageTurnaroundTime:", averageTurnaroundTime);

    return {
        totalExecutionTime,
        averageWaitingTime,
        averageTurnaroundTime,
        contextSwitches,
        cpuUtilization,
    };
}

export const calculateMetricsRR = (processos, quantum) => {
    console.log("Quantum: " + quantum);

    let tempoTotalEspera = 0;
    let tempoTotalRetorno = 0;
    let tempoTotalInativo = 0;
    let tempoAtual = 0;
    let trocasDeContexto = 0;
    //Ordenacao dos processos baseado no tempo de chegada e prioridade caso forem tempos iguais;
    const processosOrdenados = [...processos].sort((a, b) => {
        if (a.tempoChegada === b.tempoChegada) {
            return a.prioridade - b.prioridade; // Menor prioridade vem primeiro
        }
        return a.tempoChegada - b.tempoChegada;
    });
    const temposRestantes = processosOrdenados.map((p) => parseInt(p.tempoExecucao, 10));
    const temposChegada = processosOrdenados.map((p) => parseInt(p.tempoChegada, 10));

    let fila = [];
    let processosNaFila = new Set();
    let processosConcluidos = new Set();
    let ultimoProcessoExecutado = null; // Identifica o índice do processo em execução

    const adicionarNovosProcessos = () => {
        for (let i = 0; i < processosOrdenados.length; i++) {
            if (
                temposChegada[i] <= tempoAtual && // Processo chegou
                !processosNaFila.has(i) && // Não está na fila
                !processosConcluidos.has(i) && // Não está concluído
                ultimoProcessoExecutado !== i // Não está em execução
            ) {
                fila.push(i);
                processosNaFila.add(i);
                console.log(`Processo P${processosOrdenados[i].id} adicionado à fila.`);
            }
        }
    };

    while (processosConcluidos.size < processosOrdenados.length) {
        console.log(`Tempo Atual: ${tempoAtual}`);
        console.log(`Fila: [${fila.map((i) => `P${processosOrdenados[i].id}`).join(", ")}]`);

        adicionarNovosProcessos();

        if (fila.length === 0) {
            console.log("Nenhum processo na fila. CPU inativa.");
            tempoAtual++;
            tempoTotalInativo++;
            continue;
        }

        const indiceAtual = fila.shift();
        processosNaFila.delete(indiceAtual);

        const processoAtual = processosOrdenados[indiceAtual];

        console.log("processoAtivo !== null && processoAtivo !== indiceAtual: " + (ultimoProcessoExecutado !== null && ultimoProcessoExecutado !== indiceAtual));
        if (ultimoProcessoExecutado !== null && ultimoProcessoExecutado !== processoAtual.id) {
            trocasDeContexto++; // Troca de contexto porque o processo anterior foi interrompido
        }

        ultimoProcessoExecutado = indiceAtual; // Marca o processo atual como ativo

        console.log(`Executando Processo P${processoAtual.id} por até ${quantum} unidade(s).`);

        let tempoExecutado = 0;
        while (tempoExecutado < quantum && temposRestantes[indiceAtual] > 0) {
            temposRestantes[indiceAtual]--;
            tempoAtual++;
            tempoExecutado++;
            console.log(`  [Segundo ${tempoAtual}] Processo P${processoAtual.id} executando...`);

            adicionarNovosProcessos();
        }

        if (temposRestantes[indiceAtual] > 0) {
            fila.push(indiceAtual); // Retorna o processo para a fila
            processosNaFila.add(indiceAtual);
            console.log(`Processo P${processoAtual.id} retornou para a fila.`);
        } else {
            processosConcluidos.add(indiceAtual);
            const tempoConclusao = tempoAtual;
            const tempoRetorno = tempoConclusao - temposChegada[indiceAtual];
            const tempoEspera = tempoRetorno - processoAtual.tempoExecucao;

            tempoTotalRetorno += tempoRetorno;
            tempoTotalEspera += tempoEspera;

            console.log(`Processo P${processoAtual.id} concluído.`);
            console.log(`  Tempo de Conclusão: ${tempoConclusao}`);
            console.log(`  Tempo de Retorno: ${tempoRetorno}`);
            console.log(`  Tempo de Espera: ${tempoEspera}`);
        }

        console.log(`Pilha Atual: [${fila.map((i) => `P${processosOrdenados[i].id}`).join(", ")}]`);
    }

    const mediaTempoEspera = parseFloat((tempoTotalEspera / processosOrdenados.length).toFixed(2));
    const mediaTempoRetorno = parseFloat((tempoTotalRetorno / processosOrdenados.length).toFixed(2));
    const utilizacaoCPU = parseFloat((((tempoAtual - tempoTotalInativo) / tempoAtual) * 100).toFixed(2));

    console.log("Tempo Total de Execução: ", tempoAtual);
    console.log("Média do Tempo de Espera: ", mediaTempoEspera);
    console.log("Média do Tempo de Retorno: ", mediaTempoRetorno);
    console.log("Trocas de Contexto: ", trocasDeContexto);
    console.log("Utilização da CPU: ", utilizacaoCPU);

    return {
        totalExecutionTime: tempoAtual,
        averageWaitingTime: mediaTempoEspera,
        averageTurnaroundTime: mediaTempoRetorno,
        contextSwitches: trocasDeContexto,
        cpuUtilization: utilizacaoCPU,
    };
};