import { useState } from 'react';
import { MdDomain } from "react-icons/md";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IoLogoGithub } from "react-icons/io";
import { MdOutlineLightMode } from "react-icons/md";


interface Domain {
  domainName: string,
  registrarName: string,
  createdDate: string,
  expiresDate: string,
  country: string,
  organization: string,
  hostNames: string[],
  status: string,
  registrarIANAID: string,
  domainNameExt: string
}

const App: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [domainData, setDomainData] = useState<Domain | null>(null);
  const [isLightMode, setLightMode] = useState<boolean>(false);

  async function getDomainData(): Promise<Domain> {
    const response = await axios.get(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${import.meta.env.VITE_API_KEY}c&domainName=${domain}&outputFormat=json`);
    const data = response.data;

    if (data && typeof data === 'object') {
      console.log(data);

      if (!data?.WhoisRecord?.domainName) throw new Error('Unknown Domain');

      const DomainData: Domain = {
        domainName: data?.WhoisRecord?.domainName ?? 'N/A',
        registrarName: data?.WhoisRecord?.registrarName ?? 'N/A',
        createdDate: data?.WhoisRecord?.registryData?.createdDate ?? 'N/A',
        expiresDate: data?.WhoisRecord?.registryData?.expiresDate ?? 'N/A',
        country: data?.WhoisRecord?.registryData?.registrant?.country ?? data?.WhoisRecord?.administrativeContact?.country ?? 'N/A',
        organization: data?.WhoisRecord?.registryData?.registrant?.organization ?? data?.WhoisRecord?.administrativeContact?.organization ?? 'N/A',
        hostNames: data?.WhoisRecord?.registryData?.nameServers?.hostNames ?? data?.WhoisRecord?.nameServers?.hostNames ?? [],
        status: data?.WhoisRecord?.registryData?.status ?? 'N/A',
        registrarIANAID: data?.WhoisRecord?.registrarIANAID ?? 'N/A',
        domainNameExt: data?.WhoisRecord?.domainNameExt ?? 'N/A',
      }
      return DomainData;
    }

    throw new Error(`Unknown Domain`);
  }


  async function handleDomainSearch(): Promise<void> {
    const toastId = toast.loading('Searching...');
    try {
      const DomainData: Domain = await getDomainData();
      setDomainData(DomainData);
      toast.success('Success!');
      console.log(DomainData);
    } catch (e) {
      toast.error("Invalid Domain Name");
      console.log(e);
    } finally {
      toast.dismiss(toastId);
    }
  }


  return (
    <div className={`flex justify-center items-center align-center min-h-[100vh] ${isLightMode ? 'bg-[#F3F4F6] text-black' : 'text-white '}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-4 right-4 text-4xl cursor-pointer flex gap-2">
        <MdOutlineLightMode onClick={(): void => setLightMode(!isLightMode)} />
        <a target="_blank" href="https://github.com/AnmolTutejaGitHub">
          <IoLogoGithub />
        </a>
      </div>
      <div className={`p-6 flex flex-col gap-6  rounded-md w-[35%] ${isLightMode ? 'bg-white shadow-lg' : 'bg-[#111827] '}`}>
        <div className='text-xl font-bold'>Retrieve Ownership Details for Any Domain Name !</div>
        <div className='text-2xl flex justify-center'>
          <MdDomain />
        </div>
        <div className={` font-bold ${isLightMode ? 'text-gray-700' : 'text-gray-400'}`}>Enter The Domain Name You Want to Stalk</div>
        <input className={`outline-none p-3 rounded-md focus:border-2 focus:border-blue-600 ${isLightMode ? 'bg-gray-200' : 'bg-[#374151]'}`} placeholder="example.com"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDomainData(null); setDomain(e.target.value) }} value={domain}></input>
        <button className={`bg-blue-700 p-3 rounded-md font-bold focus:outline-none ${isLightMode ? 'text-white' : ''}`} onClick={handleDomainSearch}>Look</button>
        {domainData && (
          <div className={`p-4 border-2 rounded-md ${isLightMode ? 'bg-gray-200 border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
            <p className="mb-2"><span className="font-semibold">Domain Name:</span> {domainData.domainName}</p>
            <p className="mb-2"><span className="font-semibold">Domain Extension:</span> {domainData.domainNameExt}</p>
            <p className="mb-2"><span className="font-semibold">Registrar Name:</span> {domainData.registrarName}</p>
            <p className="mb-2"><span className="font-semibold">Registrar IANA ID:</span> {domainData.registrarIANAID}</p>
            <p className="mb-2"><span className="font-semibold">Organization:</span> {domainData.organization}</p>
            <p className="mb-2"><span className="font-semibold">Country:</span> {domainData.country}</p>
            <p className="mb-2"><span className="font-semibold">Created Date:</span> {domainData.createdDate}</p>
            <p className="mb-2"><span className="font-semibold">Expires At:</span> {domainData.expiresDate}</p>
            <p className="mb-2"><span className="font-semibold">Host Names:</span> {domainData.hostNames.join(' , ')}</p>
            <p className="mb-2"><span className="font-semibold">Status:</span> {domainData.status}</p>
          </div>
        )}
        <div className='flex justify-center'>Made with ❤️ by <span className='ml-1'><a target='_blank' href="https://github.com/AnmolTutejaGitHub">Anmol Tuteja</a></span></div>
      </div>


    </div >

  )
}

export default App;
