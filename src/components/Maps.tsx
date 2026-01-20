"use client";

import { YMaps, Map, Placemark } from "react-yandex-maps";
import { useState, useEffect } from "react"; // Добавляем useEffect
import { locations } from "@/data/locations";

const Maps = () => {
  const [currentLocation, setCurrentLocation] = useState("archangelsk");
  const [isMounted, setIsMounted] = useState(false); // Новое состояние для контроля монтирования

  // Эффект для установки isMounted в true только на клиенте после монтирования
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentLocationData = locations[currentLocation];

  // Не рендерим YMaps до тех пор, пока компонент не смонтирован на клиенте
  if (!isMounted) {
    // Можно вернуть заглушку с такими же размерами, чтобы не ломалась вёрстка
    return (
      <section>
        <div className="flex flex-col justify-center xl:max-w-[1208px] text-[#414141]">
          <h2 className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold">
            Наши магазины
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-3 mb-5">
            {/* Заглушка для кнопок */}
            {Object.keys(locations).map((key) => (
              <button
                key={key}
                className="p-2 text-xs justify-center items-center bg-[#f3f2f1] border-none rounded"
                disabled
              >
                {locations[key].name}
              </button>
            ))}
          </div>
          {/* Заглушка для контейнера карты с сохранением высоты */}
          <div style={{ width: "100%", height: "354px", background: "#f0f0f0" }}></div>
        </div>
      </section>
    );
  }

  // Основной рендер после монтирования
  return (
    <YMaps
      query={{
        lang: "ru_RU",
        apikey: "1ac61b8a-843f-454f-abd8-a651a3c60f00", // Рекомендуется вынести в переменные окружения
        load: "package.full",
      }}
    >
      <section>
        <div className="flex flex-col justify-center xl:max-w-[1208px] text-[#414141]">
          <h2 className="mb-4 md:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold">
            Наши магазины
          </h2>
          <div className="flex flex-wrap gap-x-2 gap-y-3 mb-5">
            {Object.keys(locations).map((key) => {
              const isActive = currentLocation === key;
              return (
                <button
                  key={key}
                  onClick={() => setCurrentLocation(key)}
                  className={`p-2 text-xs justify-center items-center active:shadow-(--shadow-button-active) border-none rounded cursor-pointer transition-colors duration-300 ${
                    isActive
                      ? "bg-(--color-primary) text-white hover:shadow-(--shadow-button-default)"
                      : "bg-[#f3f2f1] hover:shadow-(--shadow-button-secondary)"
                  }`}
                >
                  {locations[key].name}
                </button>
              );
            })}
          </div>
          <Map
            options={{ suppressMapOpenBlock: true }}
            state={{ center: currentLocationData.center, zoom: 12 }}
            width="100%"
            height="354px"
          >
            {locations[currentLocation].shops.map((shop) => (
              <Placemark
                key={shop.id}
                geometry={shop.coordinates}
                properties={{
                  hintContent: shop.name,
                }}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: "/icons-map/icon-location.svg",
                  iconImageSize: [32, 32],
                  iconOffset: [-16, -16],
                }}
              />
            ))}
          </Map>
        </div>
      </section>
    </YMaps>
  );
};

export default Maps;
