import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-[42px] px-[26px] py-[35px] relative bg-[#f9f9f9] max-w-md mx-auto">
      <div className="flex w-full max-w-[366px] items-center justify-between relative">
        <p className="relative w-fit mt-[-1.00px] font-bold text-[#12121d] text-[28px] leading-7 whitespace-nowrap">
          <span className="font-bold text-[#12121d] tracking-[-0.08px] leading-8">
            Water{" "}
          </span>

          <span className="font-bold text-[#5b8e55] tracking-[-0.08px] leading-8">
            Plants
          </span>
        </p>

        {/* <VuesaxLinearSetting2 className="w-8 h-8" /> */}
      </div>

      <div className="relative w-[137px] h-[125px]">
        <div className="relative w-[138px] h-[126px] -top-px -left-px">
          <div className="absolute w-[119px] h-[116px] top-0 left-0 bg-[#f8faf8] rounded-[14px] border border-solid border-[#60b357]" />

          <div className="absolute w-11 h-[42px] top-[84px] left-[94px]">
            <div className="relative h-[42px]">
              <div className="absolute w-[41px] h-[41px] top-px left-0.5 bg-[#60b357] rounded-[20.5px]" />

              <div className="absolute w-10 h-10 top-0 left-0">
                <div className="relative w-5 h-5 top-2.5 left-[13px]">
                  <div className="absolute w-px h-5 top-0 left-2.5 bg-white rounded-[7.41px]" />

                  <div className="absolute w-px h-5 top-0 left-[9px] bg-white rounded-[7.41px] rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap w-full max-w-[367px] items-end gap-[12px_18px]">
        <div className="flex w-full max-w-[369px] h-[49px] items-center gap-2.5 px-[21px] py-[13px] bg-white rounded-[11px] border border-solid border-[#60b357]">
          <div className="relative flex-1 font-normal text-[#969c96] text-base tracking-[0]">
            Name Of The Plant
          </div>
        </div>

        <div className="flex w-full max-w-[174px] h-[49px] items-center gap-2.5 px-[11px] py-3 bg-white rounded-[11px] border border-solid border-[#60b357]">
          <div className="relative flex-1 font-normal text-[#969c96] text-base tracking-[0]">
            Add Type
          </div>
        </div>

        <div className="flex w-full max-w-[179px] h-[49px] items-center gap-2.5 px-0.5 py-3 bg-white rounded-[11px] border border-solid border-[#60b357]">
          <div className="relative flex-1 font-normal text-[#969c96] text-base tracking-[0]">
            Add Location
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-[363px] items-start gap-[25px]">
        <div className="relative w-full max-w-[363px] h-[91px]">
          <div className="flex flex-col w-full max-w-[363px] h-[91px] items-start gap-2.5 px-[15px] py-[11px] bg-white rounded-[22px] shadow-ds">
            <div className="inline-flex items-center gap-[27px] relative flex-[0_0_auto]">
              <div className="flex w-[65px] h-[65px] items-center gap-2.5 px-6 py-[22px] bg-[#5b8e55] rounded-[13px]">
                <img
                  className="w-[18.45px] h-[22.31px] mt-[-0.65px] mb-[-0.65px] ml-[-1.01px] mr-[-0.44px]"
                  alt="Group"
                  src="https://c.animaapp.com/m8k0avscLldRQ5/img/group-49.png"
                />
              </div>

              <div className="flex flex-col w-[159px] items-start gap-1">
                <div className="relative self-stretch mt-[-1.00px] font-medium text-label-black100 text-[19.9px] tracking-[0] leading-[22.7px]">
                  Watering
                </div>

                <div className="relative self-stretch h-[22px] font-normal text-[#888888] text-sm tracking-[0]">
                  Thrice In A Week
                </div>
              </div>

              <div className="flex flex-col w-[50px] h-6 items-start gap-2.5 p-[5px] bg-[#eaf3ea] rounded-[35px]">
                <div className="w-[23px] h-[22px] mt-[-4.00px] mb-[-4.00px] ml-[-4.00px] bg-[#60b357] rounded-[39px] border-2 border-solid" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[363px] h-[91px] bg-white rounded-[22px] shadow-ds">
          <div className="flex flex-col w-[50px] h-6 items-start gap-2.5 p-[5px] absolute top-[34px] left-[292px] bg-[#eaf3ea] rounded-[35px]">
            <div className="w-[23px] h-[22px] mt-[-4.00px] mb-[-4.00px] ml-[-4.00px] bg-[#60b357] rounded-[39px] border-2 border-solid" />
          </div>

          <div className="flex w-[65px] h-[65px] items-center gap-2.5 px-4 py-[15px] absolute top-[15px] left-[15px] bg-[#5b8e55] rounded-[13px]">
            <img
              className="w-[33.23px] h-[33.23px]"
              alt="Vuesax linear sun"
              src="https://c.animaapp.com/m8k0avscLldRQ5/img/vuesax-linear-sun.svg"
            />
          </div>

          <div className="flex flex-col w-[159px] items-start gap-1 absolute top-[25px] left-[95px]">
            <div className="relative self-stretch mt-[-1.00px] font-medium text-label-black100 text-[19.9px] tracking-[0] leading-[22.7px]">
              Sunlight
            </div>

            <div className="relative self-stretch h-[18px] font-normal text-[#888888] text-sm tracking-[0]">
              Daily
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-[363px] h-[91px]">
          <div className="flex flex-col w-full max-w-[363px] h-[91px] items-start gap-2.5 px-[15px] py-[11px] bg-white rounded-[22px] shadow-ds">
            <div className="inline-flex items-center gap-[27px] relative flex-[0_0_auto]">
              <div className="flex w-[65px] h-[65px] items-center gap-2.5 px-6 py-[18px] bg-[#5b8e55] rounded-[13px]">
                <img
                  className="w-[26px] h-[25.91px] ml-[-1.00px]"
                  alt="Group"
                  src="https://c.animaapp.com/m8k0avscLldRQ5/img/group-26917.png"
                />
              </div>

              <div className="flex flex-col w-[159px] items-start gap-[3px]">
                <div className="relative self-stretch mt-[-1.00px] font-medium text-label-black100 text-[19.9px] tracking-[0] leading-[22.7px]">
                  Nutreints
                </div>

                <div className="relative self-stretch h-5 font-normal text-[#888888] text-sm tracking-[0]">
                  Thrice In A Week
                </div>
              </div>

              <div className="flex flex-col w-[50px] h-6 items-start gap-2.5 p-[5px] bg-[#eaf3ea] rounded-[35px]">
                <div className="w-[23px] h-[22px] mt-[-4.00px] mb-[-4.00px] ml-[-4.00px] bg-[#60b357] rounded-[39px] border-2 border-solid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[165.79px] h-[53.25px] items-center justify-center gap-2.5 px-[62px] py-3 bg-[#5b8e55] rounded-[31px]">
        <div className="w-fit font-medium text-white text-xl tracking-[0.40px] leading-[28.2px] whitespace-nowrap">
          ADD
        </div>
      </div>
    </div>
  );
}
