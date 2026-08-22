import type {ApplicationStep} from "@/components/ApplicationStepsView";
import type {CompanyPolicy} from "@/lib/types";

const names:Record<string,string>={kakao:"카카오",samsung:"삼성",meta:"페이스북",instagram:"인스타그램"};
const links:Record<string,Partial<Record<"download"|"delete"|"deceased"|"memorial",string>>>={
  meta:{download:"https://www.facebook.com/help/212802592074644/?locale=ko_KR",delete:"https://www.facebook.com/help/224562897555674/?locale=ko_KR",deceased:"https://www.facebook.com/help/1518259735093203/?locale=ko_KR",memorial:"https://www.facebook.com/help/requestmemorialization?locale=ko_KR"},
  instagram:{download:"https://help.instagram.com/181231772500920?locale=ko_KR",delete:"https://help.instagram.com/139886812848894?locale=ko_KR",deceased:"https://www.facebook.com/help/264154560391256/?locale=ko_KR",memorial:"https://www.facebook.com/help/264154560391256/?locale=ko_KR"},
  samsung:{download:"https://account.samsung.com/",delete:"https://account.samsung.com/",deceased:"https://digital-legacy.samsung.com/",memorial:"https://digital-legacy.samsung.com/"},
  kakao:{download:"https://privacy.kakao.com/main?lang=ko",delete:"https://accounts.kakao.com/weblogin/account/info",deceased:"https://cs.kakao.com/",memorial:"https://cs.kakao.com/helps?service=8&category=565&locale=ko"}
};

export function getCompanySteps(company:CompanyPolicy):ApplicationStep[]{
  const name=names[company.slug]??company.company;
  const fallback=company.policyLink??"/services";
  const urls=links[company.slug]??{};
  const documents=company.requiredDocs.join(", ");
  return[
    {id:1,company:name,journey:"pre_death",link_type:"guide",title:`내 ${name} 데이터 다운로드`,description:"사진, 게시물과 이용 기록의 사본을 받을 수 있는지 확인해요.",url:urls.download??fallback,required_documents:null,sort_order:1,notes:"서비스와 계정 상태에 따라 내려받을 수 있는 데이터가 달라질 수 있어요."},
    {id:2,company:name,journey:"pre_death",link_type:"guide",title:`내 ${name} 계정 삭제·해지`,description:"필요한 기록을 먼저 보관한 뒤 계정 종료 절차를 확인해요.",url:urls.delete??fallback,required_documents:null,sort_order:2,notes:"삭제가 완료되면 계정과 데이터는 복구하기 어려울 수 있어요."},
    {id:3,company:name,journey:"post_death",link_type:"request",title:`고인의 ${name} 계정 정리`,description:"고인의 계정을 삭제하거나 이용을 종료할 때 필요한 도움을 확인해요.",url:urls.deceased??fallback,required_documents:documents,sort_order:1,notes:company.limitations.join(" ")},
    {id:4,company:name,journey:"post_death",link_type:"request",title:`고인의 ${name} 기록 보존·다운로드`,description:"공개 게시물이나 제공 가능한 데이터의 보존 방법을 확인해요.",url:urls.deceased??fallback,required_documents:documents,sort_order:2,notes:"개인 메시지와 로그인 정보는 제공되지 않을 수 있어요."},
    ...(company.memorialAccount==="yes"?[{id:5,company:name,journey:"post_death" as const,link_type:"request",title:`${name} 추모 계정 전환`,description:"고인의 계정을 추모 상태로 보존하는 공식 절차를 확인해요.",url:urls.memorial??urls.deceased??fallback,required_documents:documents,sort_order:3,notes:"추모 계정의 기능과 관리 권한은 서비스 정책에 따라 제한돼요."}]:[])
  ];
}
