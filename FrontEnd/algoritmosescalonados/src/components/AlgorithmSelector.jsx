import React from "react";

const AlgorithmSelector = ({ algorithm, setAlgorithm, quantum, setQuantum }) => {
  return (
    <div className="algorithm-selector">
      <label>
        <input
          type="radio"
          value="fifo"
          checked={algorithm === "fifo"}
          onChange={() => setAlgorithm("fifo")}
        />
        FIFO
      </label>
      <label>
        <input
          type="radio"
          value="roundrobin"
          checked={algorithm === "roundrobin"}
          onChange={() => setAlgorithm("roundrobin")}
        />
        Round Robin
      </label>
      {algorithm === "roundrobin" && (
        <input
          type="number"
          placeholder="Quantum"
          value={quantum}
          onChange={(e) => setQuantum(e.target.value)}
        />
      )}
    </div>
  );
};

export default AlgorithmSelector;
