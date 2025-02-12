import Image from 'next/image';

export default function TeamSection() {
    const teamMembers = [
      {
        name: "Advino Rahmandika T",
        class: "X SIJA 1",
        role: "Front End Developer",
        image: "/assets/pino.jpg",
      },
      {
        name: "Hilda Nur Rizky",
        class: "X SIJA 1",
        role: "UI/UX Designer",
        image: "/assets/hilda.jpeg",
      },
      {
        name: "Giovanni Achmad A",
        class: "X SIJA 2",
        role: "Back End Developer",
        image: "/assets/gio.png",
      },
    ];
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100">
        <h2 className="text-6xl font-bold mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-md text-center w-96">
              <Image
                src={member.image}
                alt={member.name}
                width={192}
                height={192}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-3xl font-semibold">{member.name}</h2>
              <h3 className="text-xl font-semibold mt-2 mb-4">{member.class}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }