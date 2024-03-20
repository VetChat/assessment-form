import { Stepper } from "@mantine/core";
import React from "react";
import { ProgressBarProps } from "./interface/ProgressBar";

const ProgressBar: React.FC<ProgressBarProps> = ({ active }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full md:flex md:justify-center md:items-center sm:px-12 px-3 bg-white py-7 border">
      <Stepper
        size="xs"
        color="rgba(102, 176, 0, 1)"
        active={active}
        allowNextStepsSelect={false}
        wrap={false}
      >
        <Stepper.Step
          label="Step 1"
          description="ระบุชนิดสัตว๋เลี้ยง"
        ></Stepper.Step>
        <Stepper.Step label="Step 2" description="ประเมินอาการ"></Stepper.Step>
        <Stepper.Step label="Step 3" description="กรอกประวัติ"></Stepper.Step>
        <Stepper.Step label="Step 4" description="สรุปผล"></Stepper.Step>
      </Stepper>
    </div>
  );
};

export default ProgressBar;
